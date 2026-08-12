import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export function ChatLauncher() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 320, damping: 24 }}
      className="fixed bottom-5 right-5 z-40"
    >
      <Link
        to="/chat"
        aria-label="Chat with the studio assistant"
        className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">Ask the studio</span>
      </Link>
    </motion.div>
  );
}