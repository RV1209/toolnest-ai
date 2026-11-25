"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { tools, categories } from "@/data/tools";
import Link from "next/link";

type ToolGridProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function ToolGrid({ query, onQueryChange }: ToolGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Explore Our Tools</h2>
        <p className="mt-3 text-gray-500">Powerful tools, simple solutions.</p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search tools..."
          className="w-full bg-transparent py-2 text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCategory === category
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filteredTools.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
                <span className="mt-4 inline-block text-xs font-medium text-blue-600">
                  {tool.category}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-gray-500">
          No tools found. Try a different search or category.
        </p>
      )}
    </section>
  );
}