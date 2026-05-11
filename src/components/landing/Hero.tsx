import Link from "next/link";
import { Layers, Box, Code2, Globe2, Shapes } from "lucide-react";
import { FloatingPaths } from "@/components/ui/background-paths";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Paths — centered on hero content */}
      <div className="absolute inset-0 -top-56 sm:-top-48 md:-top-[22rem] flex items-center justify-center overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center w-full animate-fade-in-up">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-[1.15]">
          Brilliantly efficient. <br className="hidden sm:block" />
          Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AI.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto font-sans leading-relaxed px-2">
          The future of documentation is here. Scribe AI turns your processes into visual step-by-step guides effortlessly.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:scale-105 hover:border-white/40 w-full sm:w-auto backdrop-blur-sm"
          >
            Try Scribe free
          </Link>
        </div>
      </div>

      {/* Brand strip */}
      <div className="relative z-10 mt-16 sm:mt-24 md:mt-32 w-full max-w-5xl px-4 sm:px-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 sm:mb-8">
          Trusted by teams in every country around the world
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 sm:gap-8 md:gap-16 opacity-70 grayscale">
          <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold font-sans"><Layers className="h-5 w-5 sm:h-6 sm:w-6" /> Navan</div>
          <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold font-sans"><Box className="h-5 w-5 sm:h-6 sm:w-6" /> NVIDIA</div>
          <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold font-sans"><Code2 className="h-5 w-5 sm:h-6 sm:w-6" /> IBM</div>
          <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold font-sans"><Shapes className="h-5 w-5 sm:h-6 sm:w-6" /> Shopify</div>
          <div className="flex items-center gap-1.5 text-base sm:text-xl font-bold font-sans"><Globe2 className="h-5 w-5 sm:h-6 sm:w-6" /> Microsoft</div>
        </div>
      </div>
    </section>
  );
}
