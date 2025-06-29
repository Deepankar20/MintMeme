"use client"

export const Input = ({
  label,
  name,
  onChange,
  type,
}: {
  label: string;
  name: string;
  onChange: (e: any) => void;
  type?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      className="w-full p-2 rounded-md bg-[#1F1F2B] border border-[#2A2A40] focus:outline-none focus:ring-2 focus:ring-[#A599E9]"
      name={name}
      onChange={onChange}
    />
  </div>
);
