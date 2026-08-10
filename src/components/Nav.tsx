import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { LogoMark, Wordmark } from "./Logo";

const links = [
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Magnetic strength={0.15}>
          <a href="#top" className="group flex items-center gap-3">
            <LogoMark className="size-10 drop-shadow-[0_0_16px_color-mix(in_oklab,var(--primary)_45%,transparent)]" />
            <Wordmark />
          </a>
        </Magnetic>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Magnetic>
                <a
                  href={l.href}
                  className="relative text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:origin-left hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>

        <Magnetic strength={0.25}>
          <motion.a
            href="#contact"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Hire me
          </motion.a>
        </Magnetic>
      </nav>
    </motion.header>
  );
}