import { motion } from "framer-motion";
import { fadeUp, revealCard, stagger, viewportOnce } from "@/lib/motion";

const tools = [
  { name: "CapCut Pro", note: "Social-first speed cuts" },
  { name: "Premiere Pro", note: "Story edits & multicam" },
  { name: "After Effects", note: "Motion, titles, clean-up" },
  { name: "Cinematography", note: "Handheld & lit coverage" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-2">
        <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-primary">
            About
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-5xl sm:text-6xl">
            Scaleup Haldwani
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-muted-foreground">
            I&apos;m a video editor and cinematographer based in Haldwani, working with
            creators, local brands and businesses who need content that looks expensive and
            performs even better.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Whether it&apos;s a 15-second reel or a full brand film, I handle it end to end —
            shooting, editing, motion graphics, sound and colour — so the final export feels
            like one voice rather than five different hands.
          </motion.p>
        </motion.div>

        <motion.ul
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2"
        >
          {tools.map((t) => (
            <motion.li
              key={t.name}
              variants={revealCard}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="font-display text-2xl tracking-wide">{t.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.note}</div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}