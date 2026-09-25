import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, memo, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";

const ProjectLightbox = lazy(() => import("./ProjectLightbox"));

const Tile = memo(function Tile({
  project,
  index,
  featured,
  onOpen,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = isMobile ? inView : hover || (featured && inView);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onOpen(project)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 4) * 0.08 }}
      className={`group relative block w-full overflow-hidden rounded-3xl border border-border bg-card text-left ${
        featured ? "col-span-2 row-span-2" : "aspect-[9/16]"
      }`}
    >
      <img
        src={project.poster}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {(playing || featured) && (
        <video
          ref={vid}
          src={project.video}
          poster={project.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-transparent" />

      <div className="absolute left-4 top-4 flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.25em] text-bone/80">
        <span className={`size-1.5 rounded-full bg-primary ${playing ? "animate-rec" : ""}`} />
        {String(index + 1).padStart(2, "0")}
      </div>

      <span className="absolute right-4 top-4 grid size-9 scale-75 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
        <Play className="size-4 fill-current" />
      </span>

      <div className={`absolute inset-x-0 bottom-0 ${featured ? "p-6 sm:p-8" : "p-4"}`}>
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
  const [first, ...rest] = projects;

  return (
    <section id="work" className="scroll-mt-24 py-24">
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

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {first && <Tile project={first} index={0} featured onOpen={setOpen} />}
          {rest.map((p, i) => (
            <Tile key={p.id} project={p} index={i + 1} onOpen={setOpen} />
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
