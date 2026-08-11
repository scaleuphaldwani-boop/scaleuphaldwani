import { Instagram } from "lucide-react";
import { LogoMark, Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 text-sm text-muted-foreground sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <LogoMark className="size-9" />
          <Wordmark compact />
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/scaleuphaldwani/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-all duration-200 hover:-translate-y-1 hover:border-pink-500/40 hover:text-foreground"
          >
            <Instagram className="size-4" />
            <span>@scaleuphaldwani</span>
          </a>
        </div>

        <p>Video editing &amp; cinematography &middot; Haldwani, Uttarakhand</p>
      </div>
    </footer>
  );
}