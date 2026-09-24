import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { EASE } from "@/lib/motion";

const letters = (word: string, delay: number, cls = "") =>
  word.split("").map((ch, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <motion.span
        className={`inline-block ${cls}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.045 }}
      >
        {ch}
      </motion.span>
    </span>
  ));

const ticker = ["Reels", "Brand films", "Ads", "Cinematography", "Colour grade", "Motion graphics", "Sound design"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-44">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="size-2 animate-rec rounded-full bg-primary" />
          REC · Video Editor & Cinematographer · Haldwani
        </motion.div>

        <h1 className="text-[18vw] leading-[0.85] sm:text-[9rem] lg:text-[11rem]">
          <span className="block">{letters("VISUAL", 0.1)}</span>
          <span className="block">{letters("ARCHITECT.", 0.4, "text-red-fade")}</span>
        </h1>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
            className="max-w-md"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              I&apos;m <span className="font-semibold text-foreground">Scaleup Haldwani</span> —
              elevating digital storytelling through high-octane cinematography and precision
              editing. Based in Haldwani, crafting worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic strength={0.25}>
                <a
                  href="#work"
                  className="inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-1"
                >
                  View reels
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href="#contact"
                  className="inline-flex rounded-full border border-border px-7 py-3.5 text-sm font-bold transition-colors hover:bg-bone hover:text-ink"
                >
                  Start a project
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.05 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="rounded-2xl border border-border bg-card px-6 py-4">
              <p className="mb-1 text-xs uppercase text-muted-foreground">Tools</p>
              <p className="text-sm font-medium">Premiere Pro / After Effects / CapCut Pro</p>
            </div>
            <div className="rounded-2xl bg-bone px-6 py-4 text-ink">
              <p className="font-display text-3xl font-bold leading-none">48h</p>
              <p className="mt-1 text-xs uppercase opacity-60">Avg. turnaround</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y border-border py-5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl font-bold uppercase sm:text-4xl">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <span className="size-2.5 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
