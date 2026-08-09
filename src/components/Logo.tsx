import { motion } from "framer-motion";

type Props = { className?: string };

export function LogoMark({ className = "size-9" }: Props) {
  return (
    <motion.svg
      viewBox="0 0 120 90"
      className={className}
      fill="none"
      aria-hidden
      initial="hidden"
      animate="show"
      whileHover={{ rotate: -2, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="52"
        cy="16"
        r="6"
        fill="url(#logoGrad)"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          show: { opacity: 1, scale: 1, transition: { delay: 1.1, type: "spring", stiffness: 320, damping: 14 } },
        }}
        style={{ originX: "52px", originY: "16px" }}
      />
      <motion.path
        d="M4 78 C 30 74, 44 60, 56 40 L 74 74"
        stroke="url(#logoGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          show: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
        }}
      />
      <motion.path
        d="M40 78 L 78 24 L 116 78 Z"
        stroke="url(#logoGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] } },
        }}
      />
    </motion.svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="leading-none">
      <span
        className={`block font-display tracking-[0.22em] text-gradient ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        SCALEUP
      </span>
      <span
        className={`block font-display tracking-[0.5em] text-primary ${
          compact ? "text-[10px]" : "text-xs sm:text-sm"
        }`}
      >
        HALDWANI
      </span>
    </span>
  );
}