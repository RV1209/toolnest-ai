"use client";

import { useState } from "react";
import Hero from "@/components/home/Hero";
import ToolGrid from "@/components/home/ToolGrid";

export default function HomeContent() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Hero query={query} onQueryChange={setQuery} />
      <ToolGrid query={query} onQueryChange={setQuery} />
    </>
  );
}