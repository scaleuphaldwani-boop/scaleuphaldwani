import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Project } from "@/data/projects";
import { EASE, stagger } from "@/lib/motion";

export default function ProjectLightbox({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-[70] overflow-y-auto bg-background/95 p-3 sm:grid sm:place-items-center sm:p-4"
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
          preload="metadata"
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
