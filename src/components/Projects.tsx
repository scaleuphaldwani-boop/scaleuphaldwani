import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Suspense, lazy, memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Magnetic } from "./Magnetic";

const ProjectLightbox = lazy(() => import("./ProjectLightbox"));

const COUNT = projects.length;
const STEP = 360 / COUNT;

/** shortest signed angular distance (deg) between two angles */
function delta(a: number, b: number) {
  return ((((a - b) % 360) + 540) % 360) - 180;
}

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

const OrbitCard = memo(function OrbitCard({
  project,
  index,
  onOpen,
  active,
  angle,
  radius,
  width,
  depth,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  active: boolean;
  angle: number;
  radius: number;
  width: number;
  /** 0 = front and centre, 1 = far side of the ring */
  depth: number;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const near = depth < 0.4;
  const shouldLoad = useLazyVideo(cardRef, videoRef, active) && near;
  const open = useCallback(() => onOpen(project), [onOpen, project]);
  const tiltRaf = useRef(0);

  const hidden = depth > 0.6;

  const setTransform = (x: number, y: number) => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${
      active ? 1 : 0.92
    })`;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isMobile || !active) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (tiltRaf.current) return;
    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0;
      setTransform(-py * 9, px * 12);
    });
  };

  useEffect(() => setTransform(0, 0), [active]);
  useEffect(() => () => cancelAnimationFrame(tiltRaf.current), []);

  return (
    <article
      ref={cardRef}
      aria-hidden={!active}
      className="absolute left-1/2 top-1/2"
      style={{
        width,
        transform: `translate3d(-50%, -50%, 0) rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
        zIndex: Math.round(100 - depth * 100),
        pointerEvents: active ? "auto" : "none",
        visibility: hidden ? "hidden" : "visible",
        contentVisibility: hidden ? "hidden" : "visible",
      }}
    >
      <div
        ref={innerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setTransform(0, 0)}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm will-change-transform"
        style={{
          transform: `perspective(900px) scale(${active ? 1 : 0.92})`,
          opacity: Math.max(0.22, 1 - depth * 1.5),
          transition:
            "transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 320ms ease-out, box-shadow 260ms ease-out",
          boxShadow: active ? "var(--shadow-elevated)" : "none",
        }}
      >

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
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-t-3xl bg-secondary">
            <video
              ref={videoRef}
              src={shouldLoad ? project.video : undefined}
              poster={project.poster}
              muted
              loop
              playsInline
              preload="none"
              className={`h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform ${
                active ? "scale-105" : "scale-100"
              } md:group-hover:scale-110`}
            />

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
                } md:group-hover:scale-110`}
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </div>
        </button>

        <div className="flex flex-col justify-center px-4 py-3 sm:px-5 sm:py-4">
          <Magnetic strength={0.2}>
            <h3 className="font-display text-lg leading-tight tracking-wide sm:text-2xl">
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
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors duration-200 hover:text-accent active:scale-95 sm:text-sm"
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
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const handleOpen = useCallback((p: Project) => setLightbox(p), []);
  const handleClose = useCallback(() => setLightbox(null), []);

  const stageRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 260, radius: 420, height: 520 });
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState(0); // -index * STEP target
  const spring = useSpring(0, { stiffness: 90, damping: 20, mass: 0.6 });
  const ringRef = useRef<HTMLDivElement>(null);

  /* adaptive sizing: card width + orbit radius follow the viewport */
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // card must fit height: video is 9:16 + ~110px of meta
      const maxByHeight = ((Math.min(vh * 0.72, 680) - 110) * 9) / 16;
      const maxByWidth = vw < 768 ? vw * 0.62 : Math.min(vw * 0.30, 380);
      const width = Math.max(180, Math.min(maxByWidth, maxByHeight));
      const height = (width * 16) / 9 + 110;
      // ring radius keeps neighbours from colliding, scaled for small screens
      const base = width / 2 / Math.tan((Math.PI * STEP) / 360);
      const radius = base * (vw < 768 ? 1.02 : 1.22);
      setDims({ width, radius, height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* drive the ring transform from the spring without re-rendering */
  useEffect(() => {
    spring.set(rotation);
  }, [rotation, spring]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(0,0,${-dims.radius}px) rotateY(${v}deg)`;
      }
    });
  }, [spring, dims.radius]);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(0,0,${-dims.radius}px) rotateY(${spring.get()}deg)`;
    }
  }, [dims.radius, spring]);

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => {
      const next = Math.min(COUNT - 1, Math.max(0, i + dir));
      if (next !== i) navigator.vibrate?.(8);
      setRotation(-next * STEP);
      return next;
    });
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  /* pointer drag (mouse + touch) */
  const drag = useRef({ active: false, startX: 0, startRot: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, startX: e.clientX, startRot: spring.get(), moved: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    const per = Math.max(120, dims.width * 0.8); // px per card step
    const raw = drag.current.startRot + (dx / per) * STEP;
    const min = -(COUNT - 1) * STEP - STEP * 0.35;
    const max = STEP * 0.35;
    spring.set(Math.max(min, Math.min(max, raw)));
    setIndex(Math.round(-spring.get() / STEP));
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const i = Math.min(COUNT - 1, Math.max(0, Math.round(-spring.get() / STEP)));
    setIndex(i);
    setRotation(-i * STEP);
    spring.set(-i * STEP);
  };

  /* wheel navigation (horizontal or shift+wheel) */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let lock = false;
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      if (lock) return;
      lock = true;
      go(dx > 0 ? 1 : -1);
      window.setTimeout(() => (lock = false), 320);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  const progress = COUNT > 1 ? index / (COUNT - 1) : 1;

  return (
    <section id="work" className="scroll-mt-24 overflow-hidden py-20 sm:py-24">
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
          Drag, swipe or scroll the orbit — every project was shot and/or edited end to end.
        </motion.p>
      </motion.div>

      <div className="relative mt-8 sm:mt-12">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative mx-auto w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
          style={{ height: dims.height + 40, perspective: "1400px" }}
        >
          <div
            ref={ringRef}
            className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((p, i) => {
              const d = Math.abs(delta(i * STEP, index * STEP)) / 180;
              return (
                <OrbitCard
                  key={p.id}
                  project={p}
                  index={i}
                  onOpen={handleOpen}
                  active={i === index}
                  angle={i * STEP}
                  radius={dims.radius}
                  width={dims.width}
                  depth={d}
                />
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="absolute left-3 top-1/2 z-30 grid -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 p-2.5 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95 md:left-8 md:p-3"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="absolute right-3 top-1/2 z-30 grid -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 p-2.5 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95 md:right-8 md:p-3"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent shadow-glow transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${Math.max(0.12, progress || 0.12)})` }}
          />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")} — drag, swipe or
          use the arrows
        </p>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Suspense fallback={null}>
            <ProjectLightbox project={lightbox} onClose={handleClose} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
