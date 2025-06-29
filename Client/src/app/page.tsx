"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NavBar from "./components/NavBar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Page() {
  
  return (
    <div>
      <NavBar />
    </div>
  );
}
