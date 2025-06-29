"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function NavBar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0D0D0D] shadow-lg">
      <h1 className="text-xl font-bold text-white">MintMeme</h1>
      <div>
        <WalletMultiButton />
      </div>
    </div>
  );
}
