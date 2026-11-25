import ToolShell from "@/components/tools/ToolShell";
import WordCounter from "@/components/tools/WordCounter";

export const metadata = {
  title: "Word Counter | ToolNest AI",
  description: "Count words, characters, sentences and paragraphs instantly.",
};

export default function WordCounterPage() {
  return (
    <ToolShell
      title="Word Counter"
      description="Count words, characters, sentences and paragraphs as you type."
    >
      <WordCounter />
    </ToolShell>
  );
}