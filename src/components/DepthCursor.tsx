import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function DepthCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.15 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    setEnabled(media.matches);
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
      setActive(target instanceof Element && Boolean(target.closest("a,button,input,textarea,select")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] size-8 rounded-full border border-primary mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: active ? 1.9 : 1, rotate: active ? 135 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <span className="absolute left-1/2 top-1/2 h-px w-12 -translate-x-1/2 -translate-y-1/2 bg-primary" />
      <span className="absolute left-1/2 top-1/2 h-12 w-px -translate-x-1/2 -translate-y-1/2 bg-primary" />
    </motion.div>
  );
}