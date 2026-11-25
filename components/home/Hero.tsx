
import Link from "next/link";
import { Search, Sparkles, ArrowRight } from "lucide-react";

type HeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function Hero({ query, onQueryChange }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 text-center sm:px-6 sm:py-24">

      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">

        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Sparkles size={16} />
          Your everyday tools, all in one place
        </div>

        {/* Main heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 min-[400px]:text-4xl sm:text-6xl">
          All Your Tools.
          <br />
          <span className="text-blue-600">One Nest.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Simplify your everyday work with powerful free online tools.
          Compress images, manage PDFs, calculate and create with ease.
        </p>

        {/* Search box */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <Search className="ml-2 shrink-0 text-gray-400 sm:ml-3" size={22} />

          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                document
                  .getElementById("tools")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            placeholder="Search for a tool..."
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-gray-900 outline-none placeholder:text-gray-400"
          />

          <Link
            href="#tools"
            aria-label="Explore tools"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-3 py-3 font-medium text-white transition hover:bg-blue-700 sm:px-5"
          >
            <span className="hidden sm:inline">Explore</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Supporting text */}
        <p className="mt-5 text-sm text-gray-500">
          Free to use · Simple · Fast · Secure
        </p>

      </div>
    </section>
  );
}


// import { Sparkles } from "lucide-react";

// export default function Hero() {
//   return (
//     <section className="px-8 py-20 text-center">
//       <div className="mx-auto max-w-3xl">
//         <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">
//           <Sparkles size={16} />
//           Free online tools
//         </span>

//         <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
//           Your everyday <span className="text-blue-600">productivity</span>{" "}
//           toolkit
//         </h1>

//         <p className="mt-5 text-lg text-gray-500">
//           Compress images, manage PDFs, calculate GST and age, all in one
//           place. Fast, simple and free.
//         </p>

//         <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
//           <a
//             href="#tools"
//             className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
//           >
//             Explore Tools
//           </a>
//           <a
//             href="#about"
//             className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
//           >
//             Learn More
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }