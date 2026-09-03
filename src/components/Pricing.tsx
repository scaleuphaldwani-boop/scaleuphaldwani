import { motion } from "framer-motion";
import { fadeUp, revealCard, stagger, viewportOnce } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

const plans = [
  {
    name: "Reels & Edits",
    price: "₹1,500",
    note: "Starting at",
    highlights: ["Edit-only", "Sound design", "Color grade", "48h turnaround"],
    whatsappText:
      "Hi Scaleup Haldwani, I'm interested in your Reels & Edits package (Starting at ₹1,500). Can we discuss my project?",
  },
  {
    name: "Shoot + Edit",
    price: "₹8,000",
    note: "Starting at",
    featured: true,
    highlights: [
      "On-location shoot",
      "Multi-cam edit",
      "Motion graphics",
      "Final reel exports",
    ],
    whatsappText:
      "Hi Scaleup Haldwani, I'm interested in your Shoot + Edit package (Starting at ₹8,000). Can we discuss my project?",
  },
  {
    name: "Monthly Retainer",
    price: "₹22,000/mo",
    note: "Starting at",
    highlights: [
      "Recurring monthly shoot",
      "10–12 reels",
      "Priority delivery",
      "Dedicated edit pipeline",
    ],
    whatsappText:
      "Hi Scaleup Haldwani, I'm interested in your Monthly Retainer package (Starting at ₹22,000/mo). Can we discuss my project?",
  },
];

function whatsappHref(text: string) {
  return `https://wa.me/919105456076?text=${encodeURIComponent(text)}`;
}

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 border-y border-border bg-card/20 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-2xl"
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-primary">
            Pricing
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl sm:text-6xl">
            Simple, upfront rates
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Pick a package that fits your content goals. Need something custom? Every plan can be
            tailored to your shoot and delivery needs.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={revealCard}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className={`relative flex flex-col rounded-3xl border p-7 transition-shadow duration-300 hover:shadow-elevated sm:p-8 ${
                plan.featured
                  ? "border-primary/40 bg-card shadow-[0_0_60px_-24px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                  : "border-border bg-card/60"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold tracking-wide text-primary-foreground shadow-glow">
                  Featured / Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-display text-3xl tracking-wide">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.note}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <Magnetic strength={0.2}>
                  <motion.a
                    href={whatsappHref(plan.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    className="block w-full rounded-full bg-primary px-5 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-glow transition-shadow duration-200"
                  >
                    Get Custom Quote
                  </motion.a>
                </Magnetic>
                <a
                  href="#contact"
                  className="block w-full text-center text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  or use the contact form
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
