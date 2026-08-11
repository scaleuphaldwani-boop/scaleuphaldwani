import { motion } from "framer-motion";
import { useState } from "react";
import { Instagram } from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

const EMAIL = "scaleuphaldwani@gmail.com";
const PHONES = ["9105456076", "9837787246"];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const body = `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.project || "Not specified"}\n\n${form.message}`;

  const subject = `New project enquiry${form.project ? ` — ${form.project}` : ""}`;
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const submit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          name: form.name,
          email: form.email,
          "project type": form.project || "Not specified",
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
      setForm({ name: "", email: "", project: "", message: "" });
    } catch {
      setError("Couldn't send right now — opening your mail app instead.");
      window.location.href = mailto;
    } finally {
      setSending(false);
    }
  };

  const whatsapp = `https://wa.me/91${PHONES[0]}?text=${encodeURIComponent(
    `Hi Scaleup Haldwani!\n\n${body}`,
  )}`;

  const validate = () => {
    if (form.name.trim().length < 2) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return "Please enter a valid email.";
    if (form.message.trim().length < 10) return "Tell me a little more about the project.";
    return "";
  };

  const field =
    "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40";

  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.3em] text-accent">
            Contact
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-5xl sm:text-6xl">
            Let&apos;s cut something good
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-md text-muted-foreground">
            Tell me about the footage, the deadline and where it&apos;s going. I usually reply
            the same day.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 space-y-3">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${EMAIL}`}
                className="block rounded-xl border border-border bg-card px-5 py-4 text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </span>
                <span className="mt-1 block text-base text-foreground">{EMAIL}</span>
              </a>
            </Magnetic>
            <div className="grid gap-3 sm:grid-cols-2">
              {PHONES.map((p) => (
                <Magnetic key={p} strength={0.2}>
                  <a
                    href={`tel:+91${p}`}
                    className="block rounded-xl border border-border bg-card px-5 py-4 text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                      Call / WhatsApp
                    </span>
                    <span className="mt-1 block text-base text-foreground">+91 {p}</span>
                  </a>
                </Magnetic>
              ))}
            </div>

            <Magnetic strength={0.2}>
              <a
                href="https://www.instagram.com/scaleuphaldwani/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 p-2.5 text-white">
                  <Instagram className="size-5" />
                </span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  Follow on Instagram
                  <span className="mt-1 block text-base font-medium text-foreground">@scaleuphaldwani</span>
                </span>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.form
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            onSubmit={(e) => {
              e.preventDefault();
              const err = validate();
              setError(err);
              if (err) return;
              void submit();
            }}
            className="rounded-2xl border border-border bg-card p-7 shadow-elevated"
          >
            <motion.h3 variants={fadeUp} className="font-display text-3xl">
              Start a project
            </motion.h3>

            <motion.div variants={fadeUp} className="mt-6 space-y-4">
              <input
                required
                className={field}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                className={field}
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className={field}
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
              >
                <option value="">Project type</option>
                <option>Reel / Short-form</option>
                <option>Brand film</option>
                <option>Ad / Product spot</option>
                <option>Cinematography shoot</option>
                <option>Something else</option>
              </select>
              <textarea
                required
                rows={4}
                className={field}
                placeholder="Footage, deadline, references..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="submit"
              disabled={sending}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send enquiry"}
            </motion.button>

            <motion.a
              variants={fadeUp}
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 block w-full rounded-full border border-border bg-secondary px-6 py-3.5 text-center text-sm font-semibold text-foreground transition-shadow duration-200 hover:shadow-lg"
            >
              Send on WhatsApp instead
            </motion.a>

            {error && (
              <p className="mt-3 text-center text-xs text-destructive">{error}</p>
            )}
            {sent && !error && (
              <p className="mt-3 text-center text-xs text-primary">
                Enquiry sent — it&apos;s in my inbox and I&apos;ll reply the same day.
              </p>
            )}
            <motion.p variants={fadeUp} className="mt-3 text-center text-xs text-muted-foreground">
              Delivered straight to {EMAIL}
            </motion.p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}