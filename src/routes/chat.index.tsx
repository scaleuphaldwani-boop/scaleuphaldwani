import { useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { loadThreads, newThreadId } from "@/lib/chat-threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Studio Assistant | Scaleup Haldwani" },
      {
        name: "description",
        content:
          "Chat with the Scaleup Haldwani studio assistant about reels, cinematography packages, turnaround times and booking a shoot.",
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
  component: ChatIndex,
});

function ChatIndex() {
  const router = useRouter();

  useEffect(() => {
    const existing = loadThreads();
    const id = existing[0]?.id ?? newThreadId();
    void router.navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Opening your chat…
    </div>
  );
}