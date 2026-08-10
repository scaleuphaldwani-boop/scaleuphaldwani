import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { EASE, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Magnetic } from "./Magnetic";

/** Autoplays a muted inline video whenever it is on screen (essential on touch devices). */
function useAutoplayInView(ref: React.RefObject<HTMLVideoElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled]);
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useAutoplayInView(videoRef, isMobile);

  // pointer-driven 3D tilt (desktop only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 18 });

  // scroll-linked parallax on the media
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.94, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
      style={{ perspective: 1200 }}
      className="group relative"
    >
      <motion.div
        style={isMobile ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (isMobile) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        whileHover={isMobile ? undefined : { y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-elevated"
      >
        {/* animated glow sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px z-20 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, transparent 35%, color-mix(in oklab, var(--primary) 35%, transparent) 50%, transparent 65%)",
            maskImage: "linear-gradient(#000 0 0)",
          }}
        />

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left transition-transform duration-150 active:scale-95"
          aria-label={`Play ${project.title}`}
        >
          <div
            className={`relative overflow-hidden ${project.vertical ? "aspect-[9/16]" : "aspect-video"}`}
          >
            <motion.video
              ref={videoRef}
              style={isMobile ? undefined : { y: mediaY }}
              src={project.video}
              poster={project.poster}
              muted
              loop
              playsInline
              autoPlay={isMobile}
              preload="metadata"
              onMouseEnter={(e) => !isMobile && e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => !isMobile && e.currentTarget.pause()}
              aria-label={`${project.title} preview`}
              className="size-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.18]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />

            <span className="pointer-events-none absolute left-4 top-4 font-display text-4xl leading-none text-foreground/80 mix-blend-difference sm:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <motion.span
                initial={false}
                whileInView={{ scale: [0.9, 1] }}
                className="grid size-14 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-glow transition-all duration-200 md:opacity-0 md:group-hover:scale-110 md:group-hover:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.span>
            </span>
          </div>
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-[11px]"
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
      </motion.div>
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
      className="fixed inset-0 z-[70] overflow-y-auto bg-background/90 p-3 backdrop-blur-md sm:grid sm:place-items-center sm:p-4"
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
        className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
      >
        <video
          key={project.id}
          src={project.video}
          poster={project.poster}
          controls
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`w-full bg-black ${project.vertical ? "max-h-[65vh] object-contain" : ""}`}
        />
        <div className="p-5 sm:p-6">
          <h3 className="font-display text-2xl sm:text-3xl">{project.title}</h3>
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

  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
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
        <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl sm:text-6xl">
          Every cut, start to finish
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
          Every project below was shot and/or edited end to end — story, pacing, sound and grade.
        </motion.p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={() => setActive(p)} />
        ))}
      </div>

      <AnimatePresence>
        {active && <Lightbox project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
