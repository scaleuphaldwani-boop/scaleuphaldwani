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
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-6xl">Simple, upfront rates</motion.h2>
          <motion.p variants={fadeUp} className="max-w-sm text-sm text-muted-foreground">
            Every package can be tailored to your shoot and delivery needs.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-4 md:grid-cols-3 md:gap-6">
          {plans.map((plan) => {
            const f = plan.featured;
            return (
              <motion.div
                key={plan.name}
                variants={revealCard}
                whileHover={{ y: -8, rotate: f ? 0 : -0.6 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={`relative flex flex-col justify-between rounded-[2rem] p-8 ${
                  f ? "bg-bone text-ink shadow-glow" : "border border-border bg-card transition-colors hover:border-primary/40"
                }`}
              >
                {f && (
                  <span className="absolute right-8 top-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-2xl">{plan.name}</h3>
                  <p className={`mt-1 text-xs uppercase tracking-widest ${f ? "text-ink/50" : "text-muted-foreground"}`}>{plan.note}</p>
                  <p className="mt-5 font-display text-5xl font-bold tracking-tight">{plan.price}</p>
                  <ul className="mt-8 space-y-3">
                    {plan.highlights.map((item) => (
                      <li key={item} className={`flex items-center gap-3 text-sm ${f ? "text-ink/70" : "text-muted-foreground"}`}>
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 space-y-3">
                  <Magnetic strength={0.15} className="w-full">
                    <a
                      href={whatsappHref(plan.whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full rounded-xl py-4 text-center text-sm font-bold transition-colors ${
                        f ? "bg-ink text-bone hover:bg-primary" : "border border-border hover:bg-bone hover:text-ink"
                      }`}
                    >
                      Get Custom Quote
                    </a>
                  </Magnetic>
                  <a href="#contact" className={`block text-center text-xs transition-colors ${f ? "text-ink/50 hover:text-ink" : "text-muted-foreground hover:text-foreground"}`}>
                    or use the contact form
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
