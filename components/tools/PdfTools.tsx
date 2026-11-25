"use client";

import { useState, type ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { downloadBytes, formatBytes } from "@/lib/file-utils";

type Tab = "merge" | "extract";

export default function PdfTools() {
  const [tab, setTab] = useState<Tab>("merge");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setTab("merge")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "merge"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Merge PDF
        </button>
        <button
          onClick={() => setTab("extract")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "extract"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Extract pages
        </button>
      </div>

      <div className="mt-6">
        {tab === "merge" ? <MergePdf /> : <ExtractPages />}
      </div>
    </div>
  );
}

/* ---------------- Merge ---------------- */

function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => [...prev, ...picked]);
    setError("");
    e.target.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function merge() {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files.");
      return;
    }
    setBusy(true);
    setError("");

    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const src = await PDFDocument.load(await file.arrayBuffer());
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      downloadBytes(await merged.save(), "merged.pdf");
    } catch {
      setError(
        "Could not merge these files. One of them may be password-protected or damaged."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-blue-600 hover:bg-blue-50">
        <UploadCloud size={36} className="text-blue-600" />
        <p className="mt-3 font-medium text-gray-900">
          Click to add PDF files
        </p>
        <p className="mt-1 text-sm text-gray-500">
          You can select many files. Files stay on your device.
        </p>
        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={addFiles}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-6 space-y-3">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
            >
              <FileText size={20} className="shrink-0 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {index + 1}. {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === files.length - 1}
                aria-label="Move down"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => remove(index)}
                aria-label="Remove file"
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={merge}
        disabled={busy || files.length < 2}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {busy ? "Merging..." : "Merge and download"}
      </button>
    </div>
  );
}

/* ---------------- Extract pages ---------------- */

function parseRanges(input: string, total: number): number[] | null {
  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  const indices: number[] = [];
  for (const part of parts) {
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return null;
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    if (start < 1 || end > total || start > end) return null;
    for (let i = start; i <= end; i++) indices.push(i - 1);
  }
  return indices;
}

function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    setError("");
    setFile(null);
    setPageCount(0);
    setRange("");

    try {
      const doc = await PDFDocument.load(await picked.arrayBuffer());
      setFile(picked);
      setPageCount(doc.getPageCount());
    } catch {
      setError(
        "Could not read this PDF. It may be password-protected or damaged."
      );
    }
  }

  async function extract() {
    if (!file) return;

    const indices = parseRanges(range, pageCount);
    if (!indices) {
      setError(
        `Enter valid pages between 1 and ${pageCount}, for example 1-3, 5, 8-10.`
      );
      return;
    }

    setBusy(true);
    setError("");

    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));

      const base = file.name.replace(/\.pdf$/i, "");
      downloadBytes(await out.save(), `${base}-pages.pdf`);
    } catch {
      setError("Could not extract pages from this file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-blue-600 hover:bg-blue-50">
        <UploadCloud size={36} className="text-blue-600" />
        <p className="mt-3 font-medium text-gray-900">
          {file ? "Choose a different PDF" : "Click to choose a PDF"}
        </p>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={onPick}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-6">
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
            <FileText size={20} className="shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {pageCount} pages · {formatBytes(file.size)}
              </p>
            </div>
          </div>

          <label className="mt-6 block text-sm font-medium text-gray-700">
            Pages to extract
          </label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="1-3, 5, 8-10"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use commas for separate pages and a dash for a range.
          </p>

          <button
            onClick={extract}
            disabled={busy || range.trim() === ""}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Extracting..." : "Extract and download"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}