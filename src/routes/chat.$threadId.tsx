import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { LogoMark, Wordmark } from "@/components/Logo";
import {
  deleteThread,
  getThread,
  loadThreads,
  newThreadId,
  type ChatThread,
} from "@/lib/chat-threads";
import type { UIMessage } from "ai";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Studio Assistant | Scaleup Haldwani" },
      {
        name: "description",
        content:
          "Chat with the Scaleup Haldwani studio assistant about reels, cinematography packages, pricing and booking a shoot.",
      },
      { property: "og:title", content: "Studio Assistant | Scaleup Haldwani" },
      {
        property: "og:description",
        content: "Ask about reel editing, shoot packages and availability in Haldwani.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refresh = useCallback(() => setThreads(loadThreads()), []);

  useEffect(() => {
    setThreads(loadThreads());
    setInitialMessages(getThread(threadId)?.messages ?? []);
  }, [threadId]);

  const startNew = () => {
    setSidebarOpen(false);
    void navigate({ to: "/chat/$threadId", params: { threadId: newThreadId() } });
  };

  const remove = (id: string) => {
    deleteThread(id);
    const rest = loadThreads();
    setThreads(rest);
    if (id === threadId) {
      void navigate({
        to: "/chat/$threadId",
        params: { threadId: rest[0]?.id ?? newThreadId() },
        replace: true,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back to site"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <LogoMark className="size-8" />
          <div className="hidden sm:block">
            <Wordmark />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Studio Assistant
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground active:scale-95 md:hidden"
          >
            Chats
          </button>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform active:scale-95"
          >
            <Plus className="size-3.5" /> New chat
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={`${sidebarOpen ? "block" : "hidden"} w-full shrink-0 overflow-y-auto border-r border-border/60 bg-card/40 p-3 md:block md:w-64`}
        >
          <p className="px-2 pb-2 text-xs uppercase tracking-widest text-muted-foreground">
            Your chats
          </p>
          {threads.length === 0 && (
            <p className="px-2 text-xs text-muted-foreground">No saved chats yet.</p>
          )}
          <ul className="space-y-1">
            {threads.map((t) => (
              <li
                key={t.id}
                className={`group flex items-center gap-1 rounded-lg px-1 ${
                  t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"
                }`}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  onClick={() => setSidebarOpen(false)}
                  className="flex-1 truncate px-2 py-2 text-sm text-foreground/90"
                >
                  {t.title}
                </Link>
                <button
                  type="button"
                  aria-label="Delete chat"
                  onClick={() => remove(t.id)}
                  className="rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className={`min-h-0 flex-1 ${sidebarOpen ? "hidden md:block" : "block"}`}>
          {initialMessages && (
            <ChatWindow
              key={threadId}
              threadId={threadId}
              initialMessages={initialMessages}
              onThreadsChanged={refresh}
            />
          )}
        </main>
      </div>
    </div>
  );
}