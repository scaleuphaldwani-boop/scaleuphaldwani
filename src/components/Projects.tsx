import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Magnetic } from "./Magnetic";

const ProjectLightbox = lazy(() => import("./ProjectLightbox"));

/** Lazily attach the video source + autoplay the focused card's muted preview. */
function useLazyVideo(
  cardRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  autoplay: boolean,
) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && setLoad(true), {
      rootMargin: "400px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [cardRef]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !load) return;
    if (autoplay) v.play().catch(() => {});
    else v.pause();
  }, [autoplay, load, videoRef]);

  return load;
}

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onOpen,
  active,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  active: boolean;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoad = useLazyVideo(cardRef, videoRef, active);
  const open = useCallback(() => onOpen(project), [onOpen, project]);

  return (
    <article
      ref={cardRef}
      style={{ perspective: 1200 }}
      className={`group relative h-[60vh] max-h-[480px] w-auto shrink-0 snap-center md:h-[520px] md:max-h-[520px] ${
        active ? "z-20" : "z-10"
      }`}
    >
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-[transform,opacity,filter] duration-500 ease-out will-change-transform ${
          active
            ? "scale-[1.03] opacity-100 shadow-elevated"
            : "scale-90 opacity-50 blur-[1.5px] md:blur-[2px]"
        }`}
      >
        {/* glow sweep */}
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
          <div className="relative flex aspect-[9/16] h-[75%] w-auto items-center justify-center self-center overflow-hidden rounded-2xl bg-secondary">
            <video
              ref={videoRef}
              src={shouldLoad ? project.video : undefined}
              poster={project.poster}
              muted
              loop
              playsInline
              preload="none"
              onMouseEnter={(e) => !isMobile && e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => !isMobile && active === false && e.currentTarget.pause()}
              className={`h-full w-full object-contain transition-transform duration-700 ease-out will-change-transform ${
                active ? "scale-105" : "scale-100"
              } md:group-hover:scale-110`}
            />

            {/* kinetic category badge */}
            <span
              className={`pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[9px] uppercase tracking-widest text-foreground/90 backdrop-blur-md transition-all duration-300 ease-out ${
                active ? "translate-y-0 scale-100 opacity-100" : "-translate-y-1 scale-90 opacity-0"
              }`}
            >
              {project.tags[0]}
            </span>

            <span className="pointer-events-none absolute right-3 top-3 font-display text-3xl leading-none text-foreground/80 mix-blend-difference sm:text-4xl">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span
                className={`grid size-12 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-glow transition-all duration-200 ${
                  active ? "scale-100 opacity-100" : "scale-90 opacity-0"
                } md:group-hover:scale-110 md:group-hover:opacity-100`}
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </div>
        </button>

        <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.slice(0, 1).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
          <Magnetic strength={0.2}>
            <h3 className="mt-2 font-display text-xl leading-tight tracking-wide sm:text-2xl">
              {project.title}
            </h3>
          </Magnetic>
          <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:line-clamp-2 sm:block sm:text-sm">
            {project.description}
          </p>
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={open}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:text-accent active:scale-95 sm:mt-3 sm:text-sm"
            >
              Watch the cut
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </article>
  );
});

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const handleOpen = useCallback((p: Project) => setActive(p), []);
  const handleClose = useCallback(() => setActive(null), []);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bounce, setBounce] = useState(false);
  const endHit = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = el.scrollWidth - el.clientWidth;
        setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);

        // nearest card to the horizontal centre of the viewport
        const centre = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(el.children).forEach((child, i) => {
          const c = child as HTMLElement;
          const cc = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(cc - centre);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActiveIndex(best);

        if (max > 0 && el.scrollLeft >= max - 2) {
          if (!endHit.current) {
            endHit.current = true;
            navigator.vibrate?.(12);
            setBounce(true);
            window.setTimeout(() => setBounce(false), 460);
          }
        } else {
          endHit.current = false;
        }
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const step = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const w = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  return (
    <section id="work" className="scroll-mt-24 py-20 sm:py-24">
      <motion.div
        variants={stagger()}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-primary">
          Selected work
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 max-w-2xl font-display text-4xl sm:text-6xl">
          Every cut, start to finish
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-muted-foreground">
          Every project below was shot and/or edited end to end — story, pacing, sound and grade.
        </motion.p>
      </motion.div>

      <div className="relative mt-10 sm:mt-14">
        <div
          ref={trackRef}
          className={`no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[9vw] pb-4 md:px-[29vw] lg:px-[32vw] ${
            bounce ? "animate-edge-bounce" : ""
          }`}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onOpen={handleOpen}
              active={i === activeIndex}
            />
          ))}
        </div>

        {/* desktop arrows */}
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous project"
          className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 p-3 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95 md:grid"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next project"
          className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 p-3 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95 md:grid"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent shadow-glow transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${Math.max(0.12, progress || 0.12)})` }}
          />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} —
          swipe or drag to explore
        </p>
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
