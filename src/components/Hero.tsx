import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { EASE } from "@/lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const spring = { type: "spring" as const, stiffness: 420, damping: 22 };

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mesh-hero animate-drift absolute inset-[-20%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,var(--background)_78%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Video Editor &middot; Cinematographer &middot; Haldwani
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-7 max-w-4xl font-display text-6xl leading-[0.92] sm:text-8xl lg:text-[8.5rem]"
        >
          <span className="text-gradient">Frames that</span>
          <br />
          <span className="text-primary">make people stop</span>
          <span className="text-foreground"> scrolling.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-7 max-w-xl text-base text-muted-foreground sm:text-lg">
          I&apos;m Scaleup Haldwani — I edit reels, brand films and ads with CapCut Pro,
          Premiere Pro and After Effects, and shoot cinematography that actually earns
          the cut.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.25}>
            <motion.a
              href="#work"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              View my work
            </motion.a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <motion.a
              href="#contact"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-shadow duration-200 hover:shadow-lg"
            >
              Start a project
            </motion.a>
          </Magnetic>
        </motion.div>

        <motion.ul
          variants={item}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4"
        >
          {[
            ["7+", "Featured edits"],
            ["4", "Tools mastered"],
            ["48h", "Avg. turnaround"],
            ["100%", "Hands-on grade"],
          ].map(([value, label]) => (
            <li key={label}>
              <div className="font-display text-3xl text-primary">{value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}