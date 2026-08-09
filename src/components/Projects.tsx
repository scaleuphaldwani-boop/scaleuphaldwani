import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { EASE, fadeUp, revealCard, stagger, viewportOnce } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.article
      variants={revealCard}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left active:scale-95 transition-transform duration-150"
        aria-label={`Play ${project.title}`}
      >
        <div className={`relative overflow-hidden ${project.vertical ? "aspect-[9/16]" : "aspect-video"}`}>
          <img
            src={project.poster}
            alt={`${project.title} cover frame`}
            loading="lazy"
            className="size-full object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-90" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-glow transition-all duration-200 group-hover:opacity-100 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </div>
      </button>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <Magnetic strength={0.2}>
          <h3 className="mt-4 font-display text-2xl tracking-wide">{project.title}</h3>
        </Magnetic>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={onOpen}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-accent active:scale-95"
          >
            Watch the cut
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </Magnetic>
      </div>
    </motion.article>
  );
}

function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] grid place-items-center bg-background/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
      >
        <video
          key={project.id}
          src={project.video}
          poster={project.poster}
          controls
          autoPlay
          playsInline
          className={`w-full bg-black ${project.vertical ? "max-h-[70vh] object-contain" : ""}`}
        />
        <div className="p-6">
          <h3 className="font-display text-3xl">{project.title}</h3>
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(0.07, 0.15)}
            className="mt-3 flex flex-wrap gap-2"
          >
            {[project.role, project.date, ...project.tags].map((chip) => (
              <motion.span
                key={chip}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
                }}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground"
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-full border border-border px-5 py-2 text-sm transition-colors duration-200 hover:bg-secondary active:scale-95"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const featured = projects.slice(0, 3);
  const more = projects.slice(3);

  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <motion.div
        variants={stagger()}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-2xl"
      >
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-primary">
          Selected work
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 font-display text-5xl sm:text-6xl">
          Three cuts worth your minute
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
          Every project below was shot and/or edited end to end — story, pacing, sound and
          grade.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger(0.14)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setActive(p)} />
        ))}
      </motion.div>

      <motion.h3
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-24 font-display text-3xl text-muted-foreground"
      >
        More from the timeline
      </motion.h3>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {more.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setActive(p)} />
        ))}
      </motion.div>

      <AnimatePresence>
        {active && <Lightbox project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}