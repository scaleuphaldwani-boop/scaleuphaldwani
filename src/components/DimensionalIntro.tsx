import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const shutters = Array.from({ length: 8 });
const rings = Array.from({ length: 7 });

export function DimensionalIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setVisible(false), 3600);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dimensional-intro"
          role="presentation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="intro-stage fixed inset-0 z-[100] overflow-hidden bg-background"
        >
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute right-5 top-5 z-50 border border-border bg-background/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
          >
            Skip intro
          </button>

          <div className="intro-grid absolute inset-0" />
          <motion.div
            initial={{ scale: 0.04, rotate: -16, opacity: 0 }}
            animate={{ scale: [0.04, 0.04, 1.9], rotate: [-16, -16, 0], opacity: [0, 1, 1] }}
            transition={{ duration: 2.6, times: [0, 0.28, 1], ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
          >
            {rings.map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.2, 1, 2.4] }}
                transition={{ duration: 1.7, delay: 0.18 + i * 0.12, ease: "easeOut" }}
                className="intro-ring absolute rounded-full border border-primary"
                style={{ width: `${18 + i * 7}vmin`, height: `${18 + i * 7}vmin` }}
              />
            ))}
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center [perspective:900px]">
            <motion.div
              initial={{ scale: 7, rotateX: 68, z: -800, opacity: 0 }}
              animate={{ scale: [7, 1, 1, 12], rotateX: [68, 0, 0, -20], z: [-800, 0, 0, 900], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.35, times: [0, 0.38, 0.78, 1], ease: [0.76, 0, 0.24, 1] }}
              className="relative text-center [transform-style:preserve-3d]"
            >
              <motion.p
                initial={{ letterSpacing: "0.9em", opacity: 0 }}
                animate={{ letterSpacing: ["0.9em", "0.35em"], opacity: [0, 1] }}
                transition={{ duration: 1.1, delay: 0.45 }}
                className="mb-3 text-[10px] uppercase text-primary sm:text-xs"
              >
                Enter the visual dimension
              </motion.p>
              <div className="intro-title relative font-display text-[14vw] font-bold uppercase leading-[0.72] sm:text-[10vw]">
                <span className="block">Scaleup</span>
                <span className="block text-primary">Haldwani</span>
                <span aria-hidden className="intro-title-shadow absolute inset-0 text-primary">
                  <span className="block">Scaleup</span>
                  <span className="block">Haldwani</span>
                </span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{ duration: 2, delay: 0.8, times: [0, 0.25, 0.8, 1] }}
                className="mx-auto mt-8 h-px w-48 origin-center bg-primary shadow-glow"
              />
            </motion.div>
          </div>

          <div className="absolute inset-0 flex">
            {shutters.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: [1, 1, 0] }}
                transition={{ duration: 1, delay: 2.75 + i * 0.035, ease: [0.76, 0, 0.24, 1] }}
                className="h-full flex-1 origin-top border-r border-border bg-background"
              />
            ))}
          </div>
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "120%" }}
            transition={{ duration: 1.1, delay: 1.7, ease: "easeInOut" }}
            className="intro-scan absolute inset-x-0 h-24"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}