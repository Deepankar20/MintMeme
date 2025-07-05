"use client";

import React, { useState } from "react";
import NavBar from "../components/NavBar";

type FileWithPreview = File & { preview?: string };

export default function CreateCoinForm() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const preview = URL.createObjectURL(selected);
      setFile({ ...selected, preview });
    }
  };

  return (
    <div>
      <div className="min-h-screen w-screen bg-black text-white flex justify-center items-start pt-16 px-16">
        <div className="w-full flex gap-4 text-white">
          <div className="w-3/4 flex flex-col gap-4">
            <h2 className="text-4xl font-bold">Create New Coin</h2>
            <div>
              <h3 className="text-md font-semibold">coin details</h3>
              <p className="text-xs text-gray-400">
                choose carefully, these can&apos;t be changed once the coin is
                created
              </p>
            </div>

            <div className="bg-[#111] p-2 rounded-lg border border-[#222]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-md mb-1">coin name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name your coin"
                    className="w-full bg-[#0d0d0d] border border-[#333] px-3 py-2 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-md mb-1">ticker</label>
                  <input
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="add a coin ticker (e.g. DOGE)"
                    className="w-full bg-[#0d0d0d] border border-[#333] px-3 py-2 rounded-md text-white"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-md mb-1">
                  description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="write a short description"
                  className="w-full bg-[#0d0d0d] border border-[#333] px-3 py-2 rounded-md text-white h-24"
                />
              </div>

              <button
                onClick={() => setShowSocialLinks(!showSocialLinks)}
                className="text-md text-gray-400 hover:text-white flex items-center gap-1"
              >
                <span className="text-lg">🔗</span> add social links{" "}
                <span className="text-xs text-gray-500">(optional)</span>
              </button>

              {showSocialLinks && (
                <div className="mt-2">
                  {/* Add your social link inputs here */}
                  <input
                    placeholder="https://twitter.com/yourcoin"
                    className="w-full mt-2 bg-[#0d0d0d] border border-[#333] px-3 py-2 rounded-md text-white"
                  />
                </div>
              )}
            </div>

            <div className="bg-[#111] p-6 rounded-lg border border-[#222] text-center border-dashed">
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  <p className="font-semibold">
                    select video or image to upload
                  </p>
                  <p className="text-md text-gray-500">
                    or drag and drop it here
                  </p>
                  <div className="bg-green-500 px-4 py-2 mt-2 rounded-md text-black font-semibold inline-block">
                    select file
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/4 p-4 rounded-lg border border-[#222] bg-[#111] text-center">
            <h3 className="text-md font-semibold mb-2">preview</h3>
            {file?.preview ? (
              file?.type?.startsWith("video") ? (
                <video
                  src={file.preview}
                  controls
                  className="w-full rounded-md"
                />
              ) : (
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-full rounded-md"
                />
              )
            ) : (
              <p className="text-gray-500 text-md mt-8">
                a preview of how the coin will look like
              </p>
            )}

            <div className="flex justify-between">
              <div className="flex flex-col">
                {name && <div className="font-semibold">{name}</div>}
                {ticker && (
                  <div className="text-gray-400 text-md">{ticker}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
