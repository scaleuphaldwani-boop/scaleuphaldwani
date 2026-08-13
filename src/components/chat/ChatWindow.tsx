import { useCallback, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { LogoMark } from "@/components/Logo";
import { titleFromMessages, upsertThread } from "@/lib/chat-threads";

const SUGGESTIONS = [
  "What does a reel edit cost?",
  "Can you shoot in Haldwani this month?",
  "What gear and software do you use?",
];

export function ChatWindow({
  threadId,
  initialMessages,
  onThreadsChanged,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  onThreadsChanged?: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => toast.error(err.message || "The assistant is unavailable right now."),
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (messages.length === 0) return;
    upsertThread({
      id: threadId,
      title: titleFromMessages(messages),
      updatedAt: Date.now(),
      messages,
    });
    onThreadsChanged?.();
  }, [messages, threadId, onThreadsChanged]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;
      void sendMessage({ text: trimmed });
      requestAnimationFrame(() => textareaRef.current?.focus());
    },
    [isBusy, sendMessage],
  );

  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <LogoMark className="size-14" />
              <h2 className="font-display text-3xl tracking-wide text-foreground">
                Studio Assistant
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Ask about my reels, packages, turnaround times or booking a shoot in Haldwani.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent p-0 text-foreground"
                  }
                >
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && (
            <Shimmer className="text-sm">Thinking...</Shimmer>
          )}
          {error && (
            <p className="text-sm text-destructive">
              Couldn&apos;t reach the assistant. Please try again in a moment.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 bg-background/90 p-3">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              send(message.text ?? "");
              event.currentTarget.reset();
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              autoFocus
              placeholder="Ask about reels, pricing, availability…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isBusy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}