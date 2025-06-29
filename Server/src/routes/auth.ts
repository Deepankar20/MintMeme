import { Router, Request, Response } from "express";
import { generateKey, randomBytes } from "crypto";
import { prisma } from "../db/db";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { generateToken } from "../utils/jwt";

export const authRouter = Router();

authRouter.post("/request-message", async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      res.status(400).json({ data: null, msg: "Missing public key" });
      return;
    }

    const nonce = randomBytes(16).toString("hex");

    await prisma.authRequest.upsert({
      where: { publicKey }, // If there's already an entry for this wallet
      update: { nonce }, // Update the nonce
      create: { publicKey, nonce }, // Else, create a new one
    });

    res
      .status(200)
      .json({ data: nonce, msg: "Sign This Nonce To Get Verified" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ data: null, msg: "Internal Server Error" });
  }
});

authRouter.post("/verify", async (req: Request, res: Response) => {
  const { publicKey, signature, message } = req.body;

  if (!publicKey || !signature || !message) {
    res.status(400).json({ data: null, msg: "Missing fields" });
  }

  try {
    console.log(
      `publicKey : ${publicKey}, signature : ${signature}, message : ${message}`
    );

    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(publicKey)
    );

    if (!isValid) {
      res.status(401).json({ data: null, msg: "Invalid signature" });
      return;
    }

    // If user doesn't exist, create one

    const user = await prisma.user.upsert({
      where: { wallet: publicKey },
      update: { isVerified: true },
      create: { wallet: publicKey, isVerified: true, nonce: signature },
    });

    const jwt = generateToken({ id: user.id, wallet: user.wallet });

    res.status(200).json({ data: jwt, msg: "Verified succesfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server error", details: err });
  }
});
