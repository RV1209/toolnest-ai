"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

type Level = "L" | "M" | "Q" | "H";

const LEVELS: { value: Level; label: string }[] = [
  { value: "L", label: "Low" },
  { value: "M", label: "Medium" },
  { value: "Q", label: "Quartile" },
  { value: "H", label: "High" },
];

const SIZES = [256, 512, 1024];

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(512);
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [level, setLevel] = useState<Level>("M");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const value = text.trim();
    if (!value) return;

    let cancelled = false;

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark, light },
    })
      .then((url) => {
        if (cancelled) return;
        setDataUrl(url);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setError("This text is too long for a QR code. Please shorten it.");
      });

    return () => {
      cancelled = true;
    };
  }, [text, size, dark, light, level]);

  const showQr = text.trim() !== "" && dataUrl !== "" && !error;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <label className="block text-sm font-medium text-gray-700">
        Text or link
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://example.com"
        rows={3}
        className="mt-2 w-full resize-y rounded-xl border border-gray-200 p-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600"
      />

      {/* Options */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s} x {s} px
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Error correction
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            QR colour
          </label>
          <input
            type="color"
            value={dark}
            onChange={(e) => setDark(e.target.value)}
            className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background colour
          </label>
          <input
            type="color"
            value={light}
            onChange={(e) => setLight(e.target.value)}
            className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Keep the QR colour dark and the background light, otherwise scanners
        may not read it.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Result */}
      <div className="mt-8 rounded-xl bg-blue-50 p-4 text-center sm:p-6">
        {showQr ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="Generated QR code"
              className="mx-auto aspect-square w-full max-w-64 rounded-lg"
            />
            <a
              href={dataUrl}
              download="qr-code.png"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Download size={16} />
              Download PNG
            </a>
          </>
        ) : (
          <p className="py-10 text-sm text-gray-500">
            Your QR code will appear here.
          </p>
        )}
      </div>
    </div>
  );
}