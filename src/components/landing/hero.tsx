import Link from "next/link";

const keyframes = `
  @keyframes cs-scroll-grid {
    0% { background-position: 0 0; }
    100% { background-position: -100px -100px; }
  }
  @keyframes cs-fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes cs-fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;

export function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-65px)] overflow-hidden bg-[#0D0D0D] font-sans text-white">
      <style>{keyframes}</style>

      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage: `linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%),
                        linear-gradient(to right, black 0%, black 15%, transparent 25%, transparent 75%, black 85%, black 100%),
                        linear-gradient(to right, black 0%, black 25%, transparent 35%, transparent 65%, black 75%, black 100%),
                        linear-gradient(to bottom, black 0%, black 25%, transparent 40%, transparent 60%, black 75%, black 100%)`,
            maskComposite: "intersect",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-blue-600 opacity-90" />

          <div className="absolute inset-0" style={{ perspective: "1000px" }}>
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px),
                                  repeating-linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px)`,
                transform: "rotateX(60deg) translateY(20%)",
                transformOrigin: "bottom",
                animation: "cs-scroll-grid 10s linear infinite",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-24 text-center">
        <div
          className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
          style={{ animation: "cs-fade-in 1s ease-out" }}
        >
          New alerts published daily · Phase 1 live
        </div>

        <h1
          className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          style={{ animation: "cs-fade-in-up 0.8s ease-out 0.2s backwards" }}
        >
          Stay one step ahead of cyber crime.
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl"
          style={{ animation: "cs-fade-in-up 0.8s ease-out 0.4s backwards" }}
        >
          Daily explainers, world news and video breakdowns on phishing,
          ransomware, UPI fraud and the scams reshaping India&apos;s digital
          life — all in one place.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animation: "cs-fade-in-up 0.8s ease-out 0.6s backwards" }}
        >
          <Link
            href="/blog"
            className="rounded-md bg-white px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-gray-200"
          >
            Browse the blog
          </Link>
          <Link
            href="/news"
            className="rounded-md border border-white/20 bg-white/5 px-8 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Latest news
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
