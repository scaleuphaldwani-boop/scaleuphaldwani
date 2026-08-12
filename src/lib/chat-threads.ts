import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "scaleup-chat-threads";

const isBrowser = () => typeof window !== "undefined";

export function newThreadId() {
  if (isBrowser() && window.crypto?.randomUUID) return window.crypto.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

export function loadThreads(): ChatThread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* storage full or blocked — chat still works for this session */
  }
}

export function getThread(id: string): ChatThread | undefined {
  return loadThreads().find((t) => t.id === id);
}

export function upsertThread(thread: ChatThread) {
  const threads = loadThreads().filter((t) => t.id !== thread.id);
  saveThreads([thread, ...threads]);
}

export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}

export function titleFromMessages(messages: UIMessage[], fallback = "New chat") {
  const first = messages.find((m) => m.role === "user");
  if (!first) return fallback;
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return fallback;
  return text.length > 40 ? `${text.slice(0, 40)}…` : text;
}