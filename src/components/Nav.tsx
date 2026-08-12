import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
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
            className="hidden items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow sm:inline-flex"
          >
            Hire me
          </motion.a>
        </Magnetic>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border/70 text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col px-5 py-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow"
                >
                  Hire me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}