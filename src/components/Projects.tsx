import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Suspense, lazy, memo, useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { EASE, fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Magnetic } from "./Magnetic";

const ProjectLightbox = lazy(() => import("./ProjectLightbox"));

/**
 * One observer per card handles two jobs cheaply:
 *  - lazily attach the video source only when the card is near the viewport
 *  - autoplay/pause the muted inline preview while it is on screen (touch devices)
 */
function useLazyVideo(
  cardRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  autoplay: boolean,
) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setLoad(true);
        const v = videoRef.current;
        if (!v || !autoplay) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.51], rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [cardRef, videoRef, autoplay]);

  return load;
}

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onOpen,
  carousel = false,
  active = false,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  carousel?: boolean;
  active?: boolean;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoad = useLazyVideo(cardRef, videoRef, isMobile && active);

  // pointer-driven 3D tilt (desktop only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 220,
    damping: 18,
  });

  const open = useCallback(() => onOpen(project), [onOpen, project]);

  return (
    <motion.article
      ref={cardRef}
      initial={carousel ? false : { opacity: 0, y: 60, scale: 0.94 }}
      whileInView={carousel ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
      style={{ perspective: 1200 }}
      className={
        carousel
          ? `group relative w-[82vw] shrink-0 snap-center transition-[transform,opacity] duration-300 ease-out will-change-transform ${
              active ? "scale-100 opacity-100" : "scale-95 opacity-60"
            }`
          : "group relative"
      }
    >
      <motion.div
        style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (isMobile || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        whileHover={isMobile ? {} : { y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-elevated"
      >
        {/* animated glow sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px z-20 hidden rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
          style={{
            background:
              "linear-gradient(120deg, transparent 35%, color-mix(in oklab, var(--primary) 35%, transparent) 50%, transparent 65%)",
          }}
        />

        <button
          type="button"
          onClick={open}
          className="block w-full text-left transition-transform duration-150 active:scale-95"
          aria-label={`Play ${project.title}`}
        >
          <div
            className={`relative overflow-hidden bg-secondary ${project.vertical ? "aspect-[9/16]" : "aspect-video"}`}
          >
            <video
              ref={videoRef}
              src={shouldLoad ? project.video : undefined}
              poster={project.poster}
              muted
              loop
              playsInline
              preload="none"
              onMouseEnter={(e) => !isMobile && e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => !isMobile && e.currentTarget.pause()}
              aria-label={`${project.title} preview`}
              className={`size-full object-cover transition-transform duration-500 ease-out will-change-transform ${isMobile ? "" : "scale-105 group-hover:scale-110"}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />

            {carousel && (
              <span
                className={`pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 rounded-full border border-white/10 bg-background/70 px-3 py-2 text-[10px] uppercase tracking-widest text-foreground/90 backdrop-blur-sm transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="truncate">{project.tags[0]}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-primary">
                  <span className="size-1.5 animate-ping rounded-full bg-primary" />
                  Tap to preview
                </span>
              </span>
            )}

            <span className="pointer-events-none absolute left-4 top-4 font-display text-4xl leading-none text-foreground/80 mix-blend-difference sm:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-glow transition-all duration-200 md:opacity-0 md:group-hover:scale-110 md:group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
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
              onClick={open}
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
});

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const handleOpen = useCallback((p: Project) => setActive(p), []);
  const handleClose = useCallback(() => setActive(null), []);

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
          <ProjectCard key={p.id} project={p} index={i} onOpen={handleOpen} />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <Suspense fallback={null}>
            <ProjectLightbox project={active} onClose={handleClose} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
