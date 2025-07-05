import { Router, Request, Response } from "express";
import { prisma } from "../db/db";
import { z } from "zod";

import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  address,
} from "@solana/kit";

import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";

// Define your schema
const userSchema = z.object({
  id: z.string().min(1),
  wallet: z.string().min(1),
});

const bodySchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1).max(10, "Symbol must be 1–10 characters"),
  decimals: z.number().int().min(0).max(18),
  supply: z.string().regex(/^\d+$/, "Supply must be a numeric string"),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
});

interface AuthRequest extends Request {
  user?: { id: string; wallet: string }; // you can type this better if you know the structure
}

const tokenRouter = Router();

tokenRouter.post("/create", async (req: AuthRequest, res: Response) => {
  try {
    const user = userSchema.safeParse(req.user);
    const tokenMetadata = bodySchema.safeParse(req.body);

    if (!user.success) {
      console.error(user.error?.format());

      res.status(403).json({ msg: "Unauthorised", data: null });
      return;
    }

    if (!tokenMetadata.success) {
      console.error(tokenMetadata.error?.format());

      res.status(400).json({ msg: "Invalid Token Metadata", data: null });
      return;
    }

    const { id, wallet } = user.data;
    const { name, symbol, decimals, supply, description, image } =
      tokenMetadata.data;

    const rpc = createSolanaRpc("http://127.0.0.1:8899");
    const rpcSubscriptions = createSolanaRpcSubscriptions(
      "ws://localhost:8900"
    );

    const feePayer = await generateKeyPairSigner();

    await airdropFactory({ rpc, rpcSubscriptions })({
      recipientAddress: feePayer.address,
      lamports: lamports(1_000_000_000n),
      commitment: "confirmed",
    });

    const mint = await generateKeyPairSigner();

    const space = BigInt(getMintSize());
    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    const createAccountInstruction = getCreateAccountInstruction({
      payer: feePayer,
      newAccount: mint,
      lamports: rent,
      space,
      programAddress: TOKEN_2022_PROGRAM_ADDRESS,
    });

    const initializeMintInstruction = getInitializeMintInstruction({
      mint: mint.address,
      decimals: decimals,
      mintAuthority: address(wallet),
    });

    const instructions = [createAccountInstruction, initializeMintInstruction];

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }), // Create transaction message
      (tx) => setTransactionMessageFeePayerSigner(feePayer, tx), // Set fee payer
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx), // Set transaction blockhash
      (tx) => appendTransactionMessageInstructions(instructions, tx) // Append instructions
    );

    const signedTransaction = await signTransactionMessageWithSigners(
      transactionMessage
    );

    if (!signedTransaction) {
      res.status(400).json({ msg: "Error on Signing Tx", data: null });
      return;
    }

    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
      signedTransaction,
      { commitment: "confirmed" }
    );

    const transactionSignature = getSignatureFromTransaction(signedTransaction);

    if (!transactionSignature) {
      res.status(400).json({ msg: "Error on creating token", data: null });
      return;
    }

    const token = await prisma.token.create({
      data: {
        mint: mint.address,
        name,
        symbol,
        decimals,
        logoUrl: image,
        totalSupply: supply,
        chain: "solana",
        signature: transactionSignature,
        description,
      },
    });

    if (!token) {
      res.status(400).json({ msg: "Database failed", data: null });
      return;
    }

    res.status(200).json({ msg: "Successfully Created Token", data: token });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", data: null });
    return;
  }
});

tokenRouter.post("/image-upload", async () => {});

tokenRouter.get("/:mint", async () => {});

tokenRouter.get("/", async () => {});

export default tokenRouter;
