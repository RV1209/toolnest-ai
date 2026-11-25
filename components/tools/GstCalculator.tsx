"use client";

import { useState } from "react";

const RATES = [5, 12, 18, 28];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function GstCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  const value = parseFloat(amount);
  const hasValue = !isNaN(value) && value > 0;

  let base = 0;
  let gst = 0;
  let total = 0;

  if (hasValue) {
    if (mode === "exclusive") {
      base = value;
      gst = (value * rate) / 100;
      total = base + gst;
    } else {
      total = value;
      base = (value * 100) / (100 + rate);
      gst = total - base;
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Mode */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setMode("exclusive")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "exclusive"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Add GST
        </button>
        <button
          onClick={() => setMode("inclusive")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "inclusive"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Remove GST
        </button>
      </div>

      {/* Amount */}
      <label className="mt-6 block text-sm font-medium text-gray-700">
        {mode === "exclusive" ? "Amount (without GST)" : "Amount (with GST)"}
      </label>
      <div className="mt-2 flex items-center rounded-xl border border-gray-200 px-4 focus-within:border-blue-600">
        <span className="text-gray-400">₹</span>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-transparent px-2 py-3 text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Rate */}
      <label className="mt-6 block text-sm font-medium text-gray-700">
        GST rate
      </label>
      <div className="mt-2 flex flex-wrap gap-3">
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => setRate(r)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              rate === r
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {r}%
          </button>
        ))}
      </div>

      {/* Result */}
      {hasValue && (
        <div className="mt-8 space-y-3 rounded-xl bg-blue-50 p-5">
          <Row label="Base amount" value={formatINR(base)} />
          <Row label={`CGST (${rate / 2}%)`} value={formatINR(gst / 2)} />
          <Row label={`SGST (${rate / 2}%)`} value={formatINR(gst / 2)} />
          <Row label={`Total GST (${rate}%)`} value={formatINR(gst)} />
          <div className="border-t border-blue-200 pt-3">
            <Row label="Total amount" value={formatINR(total)} bold />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "text-lg font-bold text-gray-900" : "text-gray-700"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}