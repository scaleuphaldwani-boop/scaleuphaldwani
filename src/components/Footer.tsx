import { Instagram } from "lucide-react";
import { LogoMark, Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground sm:flex-row sm:px-8">
        <div className="flex items-center gap-3">
          <LogoMark className="size-9" />
          <Wordmark compact />
        </div>
        <p>Video editing &amp; cinematography &middot; Haldwani, Uttarakhand</p>
      </div>
    </footer>
  );
}