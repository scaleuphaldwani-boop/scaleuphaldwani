import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 90, damping: 20 });
  const rotateX = useSpring(pointerY, { stiffness: 90, damping: 20 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const titleZ = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 9);
        pointerY.set(-((event.clientY - rect.top) / rect.height - 0.5) * 7);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
      className="depth-stage relative min-h-[92svh] overflow-hidden pt-32 sm:pt-44"
    >
      <div aria-hidden className="depth-grid pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute left-[8%] top-[20%] size-52 rounded-full border border-primary/20 sm:size-80"
      >
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
        <span className="absolute inset-[18%] rounded-full border border-border" />
      </motion.div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="size-2 animate-rec rounded-full bg-primary" />
          REC · Video Editor & Cinematographer · Haldwani
        </motion.div>

        <motion.h1
          style={{ rotateX, rotateY, z: titleZ, y: titleY, opacity: titleOpacity }}
          className="relative text-[18vw] leading-[0.85] [transform-style:preserve-3d] sm:text-[9rem] lg:text-[11rem]"
        >
          <span aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 text-primary/20 [transform:translateZ(-70px)]">VISUAL<br />ARCHITECT.</span>
          <span className="block">{letters("VISUAL", 0.1)}</span>
          <span className="block">{letters("ARCHITECT.", 0.4, "text-red-fade")}</span>
        </motion.h1>

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
            style={{ rotateX: useTransform(rotateX, (v) => v * -0.65), rotateY: useTransform(rotateY, (v) => v * -0.65) }}
            className="grid grid-cols-2 gap-3 [transform-style:preserve-3d]"
          >
            <div className="rounded-2xl border border-border bg-card px-6 py-4 [transform:translateZ(35px)]">
              <p className="mb-1 text-xs uppercase text-muted-foreground">Tools</p>
              <p className="text-sm font-medium">Premiere Pro / After Effects / CapCut Pro</p>
            </div>
            <div className="rounded-2xl bg-bone px-6 py-4 text-ink [transform:translateZ(70px)]">
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
