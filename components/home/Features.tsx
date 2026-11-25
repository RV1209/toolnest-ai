import { Zap, ShieldCheck, Gift, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast",
    description: "Tools that load quickly and give results instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    description: "Simple, safe tools built with your privacy in mind.",
  },
  {
    icon: Gift,
    title: "Free to use",
    description: "Everyday tools without hidden charges or sign-ups.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Use it on your phone, tablet or computer.",
  },
];

export default function Features() {
  return (
    <section id="about" className="bg-gray-50 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why ToolNest AI?
          </h2>
          <p className="mt-3 text-gray-500">
            Everything you need, without the clutter.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}