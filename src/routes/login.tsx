import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { LogoMark, Wordmark } from "@/components/Logo";

const title = "Sign in | Scaleup Haldwani";
const description =
  "Sign in to your Scaleup Haldwani account to connect apps and assistants to the studio portfolio.";

function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ next: safeNext(s['next']) }),
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const field =
    "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/40";

  const returnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${next}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: returnUrl },
      });
      setBusy(false);
      if (err) return setError(err.message);
      setMessage("Check your email to confirm your account, then come back here.");
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) return setError(err.message);
    window.location.href = next;
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: returnUrl });
    if (result.error) return setError("Google sign-in failed. Please try again.");
    if (result.redirected) return;
    void navigate({ to: next });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" />
          <Wordmark />
        </div>
        <h1 className="mt-8 font-display text-4xl">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to authorise apps and assistants to use this studio&apos;s tools.
        </p>

        <button
          type="button"
          onClick={() => void google()}
          className="mt-7 w-full rounded-full border border-border bg-secondary px-6 py-3.5 text-sm font-semibold transition-shadow duration-200 hover:shadow-lg"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="email"
            className={field}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            className={field}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        {error && <p role="alert" className="mt-4 text-center text-xs text-destructive">{error}</p>}
        {message && <p className="mt-4 text-center text-xs text-primary">{message}</p>}
      </div>
    </main>
  );
}