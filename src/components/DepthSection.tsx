import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

export function DepthSection({ children }: { children: ReactNode; index: number }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      {children}
      <motion.div
        aria-hidden
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-[8%] top-0 h-px origin-center bg-primary shadow-glow"
      />
    </div>
  );
}