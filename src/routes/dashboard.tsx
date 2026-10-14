import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { projects } from "@/data/projects";
import { Wordmark } from "@/components/Logo";

const title = "Studio Dashboard | Scaleup Haldwani";
const description = "Private studio dashboard to review reels and manage client quotes.";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { next: "/dashboard" } });
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Enquiry = {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  message: string;
  status: string;
  quote_amount: number | null;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "quoted", "won", "lost"] as const;

function Dashboard() {
  const [tab, setTab] = useState<"quotes" | "reels">("quotes");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user?.id ?? "").eq("role", "admin").maybeSingle();
      setIsAdmin(Boolean(role));
      if (!role) return;
      const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      setRows((data as Enquiry[]) ?? []);
    })();
  }, []);

  const update = async (id: string, patch: Partial<Enquiry>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await supabase.from("enquiries").update(patch).eq("id", id);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    setRows((r) => r.filter((x) => x.id !== id));
    await supabase.from("enquiries").delete().eq("id", id);
  };
  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const field = "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground";

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/"><Wordmark /></Link>
          <button onClick={() => void signOut()} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Sign out</button>
        </header>
        <h1 className="mt-10 font-display text-5xl">Studio dashboard</h1>

        {isAdmin === false && (
          <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            This dashboard is only for the studio owner. Sign in with scaleuphaldwani@gmail.com (email confirmed) to manage quotes.
          </p>
        )}

        {isAdmin && (
          <>
            <div className="mt-8 flex gap-2">
              {(["quotes", "reels"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                  {t === "quotes" ? `Quotes (${rows.length})` : `Reels (${projects.length})`}
                </button>
              ))}
            </div>

            {tab === "quotes" && (
              <section className="mt-6">
                <div className="mb-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest">
                  {["all", ...STATUSES].map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 ${filter === s ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                      {s} ({s === "all" ? rows.length : rows.filter((r) => r.status === s).length})
                    </button>
                  ))}
                </div>
                {shown.length === 0 && <p className="text-sm text-muted-foreground">No enquiries yet. New ones from your contact form appear here.</p>}
                <div className="grid gap-4">
                  {shown.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="font-display text-xl">{r.name}</h2>
                          <a href={`mailto:${r.email}`} className="text-sm text-primary">{r.email}</a>
                          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                            {r.project_type ?? "Not specified"} · {new Date(r.created_at).toLocaleString()}
                          </p>
                        </div>
                        <select
                          aria-label={`Status for enquiry from ${r.name}`}
                          value={r.status}
                          onChange={(e) => void update(r.id, { status: e.target.value })}
                          className={field}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <input
                          aria-label={`Quote amount in rupees for enquiry from ${r.name}`}
                          type="number" min={0} placeholder="Quote ₹"
                          defaultValue={r.quote_amount ?? ""}
                          onBlur={(e) => void update(r.id, { quote_amount: e.target.value ? Number(e.target.value) : null })}
                          className={`${field} w-36`}
                        />
                        <input
                          aria-label={`Private notes for enquiry from ${r.name}`}
                          placeholder="Private notes" defaultValue={r.notes ?? ""}
                          onBlur={(e) => void update(r.id, { notes: e.target.value || null })}
                          className={`${field} min-w-0 flex-1`}
                        />
                        <button onClick={() => void remove(r.id)} className="rounded-lg border border-border px-3 py-2 text-sm text-destructive">Delete</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tab === "reels" && (
              <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {projects.map((p) => (
                  <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                    <video src={p.video} poster={p.poster} controls muted playsInline preload="none" className="aspect-[9/16] w-full bg-background object-cover" />
                    <div className="p-3">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.role} · {p.date}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
