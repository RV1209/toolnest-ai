"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

function getStats(text: string) {
  const trimmed = text.trim();

  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences =
    trimmed === "" ? 0 : (trimmed.match(/[^.!?।]+[.!?।]*/g) ?? []).length;
  const paragraphs =
    trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingMinutes = words / 200;

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
}

function formatReadingTime(minutes: number) {
  if (minutes === 0) return "0 sec";
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`;
  return `${Math.ceil(minutes)} min`;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = getStats(text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No spaces" value={stats.charactersNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={formatReadingTime(stats.readingMinutes)} />
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        className="mt-6 w-full resize-y rounded-xl border border-gray-200 p-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600"
      />

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          disabled={!text}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy text"}
        </button>

        <button
          onClick={() => setText("")}
          disabled={!text}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-blue-50 p-4 text-center">
      <p className="text-2xl font-bold text-blue-600">
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  );
}