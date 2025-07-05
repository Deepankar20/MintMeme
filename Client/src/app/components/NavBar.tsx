"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import bs58 from "bs58";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { publicKey, signMessage, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMessage = async () => {
      if (!publicKey) return;

      if (localStorage.getItem("__Mintmeme_Auth_Token")) return;
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/request-message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicKey: publicKey.toBase58(),
            }),
          }
        );

        const data = await res.json();
        const message = data.msg;
        const nonce = data.data;

        // Now sign the message using wallet
        const encodedMessage = new TextEncoder().encode(message + nonce);
        const signature = await signMessage!(encodedMessage);

        const signatureBase58 = bs58.encode(signature);

        // Send signed message to backend for verification
        const verifiedRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicKey: publicKey.toBase58(),
              message: message + nonce,
              signature: signatureBase58,
            }),
          }
        );

        const token = await verifiedRes.json();
        const jwtToken = token.data;

        if (jwtToken) {
          localStorage.setItem("__Mintmeme_Auth_Token", jwtToken);
        }

        // Save session/token if any returned here
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (connected && signMessage) {
      fetchMessage();
    }
  }, [publicKey, connected, signMessage]);
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0D0D0D] shadow-lg">
      <h1 className="text-xl font-bold text-white">MintMeme</h1>
      <div className="flex gap-2">
        <button className="bg-[#512da8] font-semibold text-white font-medium text-sm px-4 py-2 rounded-sm border border-transparent hover:bg-[#1A1F2E] cursor-pointer transition-colors duration-200" onClick={()=>{
          router.push("/create")
        }}>
          Create Coin
        </button>

        <WalletMultiButton />
      </div>
    </div>
  );
}
