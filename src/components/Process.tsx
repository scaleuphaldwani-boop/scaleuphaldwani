import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, revealCard, stagger, viewportOnce } from "@/lib/motion";

const steps = [
  {
    n: "01",
    title: "Brief & Direction",
    body: "We lock the goal, the audience and the reference board. I map the hook, the beats and the ending before a single clip is touched.",
  },
  {
    n: "02",
    title: "Shoot / Cinematography",
    body: "Handheld or sticks, natural or lit — I shoot coverage that cuts. Framing, movement and sound are planned for the edit, not fixed in it.",
  },
  {
    n: "03",
    title: "Assembly & Story",
    body: "Selects, spine, rhythm. Premiere Pro for the story pass, CapCut Pro when a social-first cut needs speed and punch.",
  },
  {
    n: "04",
    title: "Motion & Sound",
    body: "After Effects titles, tracked graphics and clean-ups, layered with SFX and music mixed so the cut lands even on phone speakers.",
  },
  {
    n: "05",
    title: "Grade & Delivery",
    body: "Cinematic colour pass, exports for every aspect ratio, and one round of revisions baked in. Usually back with you inside 48 hours.",
  },
];

export function Process() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="process" className="relative scroll-mt-24 border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-2xl"
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-accent">
            The process
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-5xl sm:text-6xl">
            From brief to final export
          </motion.h2>
        </motion.div>

        <motion.ol
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative mt-14 space-y-4 border-l border-border pl-6 sm:pl-10"
        >
          {steps.map((s, i) => {
            const active = open === i;
            return (
              <motion.li key={s.n} variants={revealCard} className="relative">
                <span
                  className={`absolute -left-[31px] top-6 size-3 rounded-full border-2 transition-all duration-200 sm:-left-[47px] ${
                    active
                      ? "border-primary bg-primary shadow-glow scale-125"
                      : "border-border bg-background"
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setOpen(i)}
                  whileHover={{ y: -4, scale: 1.005 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className={`w-full rounded-2xl border p-6 text-left transition-shadow duration-200 hover:shadow-lg ${
                    active ? "border-primary/40 bg-card" : "border-border bg-card/50"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-primary">{s.n}</span>
                    <span className="font-display text-2xl tracking-wide">{s.title}</span>
                  </div>
                  <motion.p
                    initial={false}
                    animate={{
                      height: active ? "auto" : 0,
                      opacity: active ? 1 : 0,
                      marginTop: active ? 12 : 0,
                    }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden text-sm leading-relaxed text-muted-foreground"
                  >
                    {s.body}
                  </motion.p>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}