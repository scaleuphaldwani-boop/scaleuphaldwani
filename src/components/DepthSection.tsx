import { motion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

export function DepthSection({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [index % 2 ? -7 : 7, 0, 0, index % 2 ? 5 : -5]);
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.94, 1, 1, 0.97]);
  const y = useTransform(scrollYProgress, [0, 0.22, 0.8, 1], [90, 0, 0, -40]);

  return (
    <div ref={ref} className="relative [perspective:1400px]">
      <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 50%" }} className="[transform-style:preserve-3d]">
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        style={{ scaleX: useTransform(scrollYProgress, [0.05, 0.45], [0, 1]) }}
        className="pointer-events-none absolute inset-x-[8%] top-0 h-px origin-center bg-primary shadow-glow"
      />
    </div>
  );
}