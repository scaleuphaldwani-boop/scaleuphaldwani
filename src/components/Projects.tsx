import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Suspense, lazy, memo, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { EASE } from "@/lib/motion";

const ProjectLightbox = lazy(() => import("./ProjectLightbox"));

const Tile = memo(function Tile({
  project,
  index,
  featured,
  onOpen,
  activeMobile,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  onOpen: (p: Project) => void;
  activeMobile: boolean;
}) {
  const vid = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 24 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 24 });

  const playing = activeMobile || hover;

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  useEffect(() => {
    if (!playing) setReady(false);
  }, [playing]);

  return (
    <motion.button
      type="button"
      data-project-tile={project.id}
      onClick={() => onOpen(project)}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHover(true); }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 12);
        tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 12);
      }}
      onPointerLeave={() => { setHover(false); tiltX.set(0); tiltY.set(0); }}
      style={reduced ? {} : { rotateX, rotateY }}
      initial={reduced ? false : { opacity: 0, y: 95, scale: 0.78, rotateZ: index % 2 ? 8 : -8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: EASE, delay: (index % 4) * 0.1 }}
      className={`depth-card group relative block w-full overflow-hidden rounded-3xl border border-border bg-card text-left ${
        featured ? "col-span-2 row-span-2" : "aspect-[9/16]"
      }`}
    >
      <img
        src={project.poster}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {playing && (
        <video
          ref={vid}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-transparent" />

      <div className="absolute left-4 top-4 flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.25em] text-bone/80 [transform:translateZ(35px)]">
        <span className={`size-1.5 rounded-full bg-primary ${playing ? "animate-rec" : ""}`} />
        {String(index + 1).padStart(2, "0")}
      </div>

      <span className="absolute right-4 top-4 grid size-9 scale-75 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
        <Play className="size-4 fill-current" />
      </span>

      <div className={`absolute inset-x-0 bottom-0 [transform:translateZ(45px)] ${featured ? "p-6 sm:p-8" : "p-4"}`}>
        {featured && (
          <span className="mb-3 inline-block rounded bg-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary-foreground">
            Featured
          </span>
        )}
        <h3
          className={`font-display font-bold leading-tight text-bone ${
            featured ? "text-2xl sm:text-4xl" : "text-sm sm:text-base"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-1 translate-y-2 text-[11px] uppercase tracking-widest text-bone/60 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
            featured ? "opacity-100 translate-y-0" : ""
          }`}
        >
          {project.role} · {project.tags[0]}
        </p>
      </div>
    </motion.button>
  );
});

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const [activeMobile, setActiveMobile] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [first, ...rest] = projects;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    let observing = false;
    const update = () => {
      frame = 0;
      if (!media.matches || !observing || document.hidden || open) {
        setActiveMobile(null);
        return;
      }
      const center = window.innerHeight * 0.48;
      let closest: string | null = null;
      let distance = Infinity;
      section.querySelectorAll<HTMLElement>("[data-project-tile]").forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.18 || rect.top > window.innerHeight * 0.82) return;
        const next = Math.abs((rect.top + rect.bottom) / 2 - center);
        if (next < distance) { distance = next; closest = tile.dataset['projectTile'] ?? null; }
      });
      setActiveMobile((current) => current === closest ? current : closest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      observing = Boolean(entry?.isIntersecting);
      schedule();
    }, { rootMargin: "400px 0px" });
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  return (
    <section ref={sectionRef} id="work" className="relative scroll-mt-24 py-24 [perspective:1200px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-12 flex items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-6xl"
          >
            Selected Reels
          </motion.h2>
          <p className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
            {String(projects.length).padStart(2, "0")} Production files
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 [transform-style:preserve-3d] sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {first && <Tile project={first} index={0} featured onOpen={setOpen} activeMobile={activeMobile === first.id} />}
          {rest.map((p, i) => (
            <Tile key={p.id} project={p} index={i + 1} onOpen={setOpen} activeMobile={activeMobile === p.id} />
          ))}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="group relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-80">Your film</span>
            <span className="font-display text-2xl font-bold leading-none sm:text-3xl">
              Next reel could be yours
              <span className="mt-3 block text-4xl transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </span>
          </motion.a>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <ProjectLightbox project={open} onClose={() => setOpen(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
