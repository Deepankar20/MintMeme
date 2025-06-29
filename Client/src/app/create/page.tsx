"use client";
import { useState } from "react";
import { Input } from "../components/Input";

export default function CreateToken() {
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: "",
    image: "",
    freezeAuthority: true,
    mintAuthority: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setTokenData({
      ...tokenData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreate = () => {
    console.log("Creating token with data:", tokenData);
    // Call Solana SDK or backend here
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#121212] p-6 rounded-2xl shadow-lg text-white">
      <h1 className="text-2xl mb-6 font-semibold">🪙 Create Your Meme Token</h1>
      <Input label="Token Name" name="name" onChange={handleChange} />
      <Input label="Symbol" name="symbol" onChange={handleChange} />
      <Input
        label="Total Supply"
        name="supply"
        type="number"
        onChange={handleChange}
      />
      <Input
        label="Decimal Precision"
        name="decimals"
        type="number"
        onChange={handleChange}
      />
      <Input
        label="Image URL (optional)"
        name="image"
        onChange={handleChange}
      />

      <div className="flex items-center gap-4 mb-4">
        <label>
          <input
            type="checkbox"
            name="mintAuthority"
            checked={tokenData.mintAuthority}
            onChange={handleChange}
          />{" "}
          Mint Authority
        </label>
        <label>
          <input
            type="checkbox"
            name="freezeAuthority"
            checked={tokenData.freezeAuthority}
            onChange={handleChange}
          />{" "}
          Freeze Authority
        </label>
      </div>

      <button
        onClick={handleCreate}
        className="w-full bg-[#A599E9] hover:bg-[#14F195] transition font-semibold py-2 px-4 rounded-lg"
      >
        🚀 Create Token
      </button>
    </div>
  );
}
