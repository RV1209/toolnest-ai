"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, Download, RefreshCw } from "lucide-react";
import { formatBytes } from "@/lib/file-utils";

type Format = "image/jpeg" | "image/webp";

type Result = {
  url: string;
  size: number;
  width: number;
  height: number;
};

const FORMAT_EXT: Record<Format, string> = {
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const WIDTH_OPTIONS = [
  { label: "Original size", value: 0 },
  { label: "1920 px wide", value: 1920 },
  { label: "1280 px wide", value: 1280 },
  { label: "800 px wide", value: 800 },
];

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const jobRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function compress(f: File, q: number, fmt: Format, mw: number) {
    const job = ++jobRef.current;
    setBusy(true);
    setError("");

    try {
      const bitmap = await createImageBitmap(f);
      const scale = mw > 0 && bitmap.width > mw ? mw / bitmap.width : 1;
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // White background so transparent PNGs do not turn black
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, fmt, q)
      );
      if (!blob) throw new Error("Compression failed");
      if (job !== jobRef.current) return;

      const url = URL.createObjectURL(blob);
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, size: blob.size, width, height };
      });
    } catch {
      if (job === jobRef.current) {
        setError("Could not process this image. Try a different file.");
      }
    } finally {
      if (job === jobRef.current) setBusy(false);
    }
  }

  function handleFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResult(null);
    compress(f, quality, format, maxWidth);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  }

  function changeQuality(value: number) {
    const q = value / 100;
    setQuality(q);
    if (file) compress(file, q, format, maxWidth);
  }

  function changeFormat(fmt: Format) {
    setFormat(fmt);
    if (file) compress(file, quality, fmt, maxWidth);
  }

  function changeWidth(value: number) {
    setMaxWidth(value);
    if (file) compress(file, quality, format, value);
  }

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result) URL.revokeObjectURL(result.url);
    jobRef.current++;
    setFile(null);
    setOriginalUrl("");
    setResult(null);
    setError("");
    setBusy(false);
  }

  const savings =
    file && result ? Math.round((1 - result.size / file.size) * 100) : 0;
  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-compressed.${FORMAT_EXT[format]}`
    : "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="hidden"
      />

      {!file && (
        <label
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-14 text-center transition hover:border-blue-600 hover:bg-blue-50"
        >
          <UploadCloud size={40} className="text-blue-600" />
          <p className="mt-4 font-medium text-gray-900">
            Click to choose an image or drag and drop here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            JPG, PNG or WebP. Your image never leaves your device.
          </p>
        </label>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {file && (
        <div>
          {/* Controls */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>Quality</span>
                <span className="text-blue-600">
                  {Math.round(quality * 100)}%
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={Math.round(quality * 100)}
                onChange={(e) => changeQuality(Number(e.target.value))}
                className="mt-3 w-full accent-blue-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                Lower quality gives a smaller file.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resize
              </label>
              <select
                value={maxWidth}
                onChange={(e) => changeWidth(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
              >
                {WIDTH_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Output format
            </label>
            <div className="mt-2 flex gap-3">
              {(["image/jpeg", "image/webp"] as Format[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => changeFormat(fmt)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                    format === fmt
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {FORMAT_EXT[fmt].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Previews */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-700">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Original"
                className="mx-auto mt-3 max-h-64 rounded-lg object-contain"
              />
              <p className="mt-3 text-lg font-bold text-gray-900">
                {formatBytes(file.size)}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-700">
                Compressed {busy && "(working...)"}
              </p>
              {result ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Compressed"
                    className="mx-auto mt-3 max-h-64 rounded-lg object-contain"
                  />
                  <p className="mt-3 text-lg font-bold text-blue-600">
                    {formatBytes(result.size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {result.width} x {result.height} px
                  </p>
                </>
              ) : (
                <p className="mt-12 text-sm text-gray-500">Processing...</p>
              )}
            </div>
          </div>

          {result && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                savings > 0 ? "text-green-600" : "text-amber-600"
              }`}
            >
              {savings > 0
                ? `You saved ${savings}% of the file size.`
                : "This file came out larger. Try lowering the quality or resizing."}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {result && (
              <a
                href={result.url}
                download={downloadName}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Download size={16} />
                Download
              </a>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              New image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}