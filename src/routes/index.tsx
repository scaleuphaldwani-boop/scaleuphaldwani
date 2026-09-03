import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ChatLauncher } from "@/components/ChatLauncher";

const title = "Scaleup Haldwani | Video Editor & Cinematographer";
const description =
  "Scaleup Haldwani — video editor and cinematographer crafting reels, brand films and ads with CapCut Pro, Premiere Pro and After Effects.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Global premium background: drifting ice aurora + blueprint grid + film grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="aurora-page animate-aurora absolute inset-[-10%]" />
        <div className="bg-grid-fade absolute inset-0" />
        <div className="bg-grain absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_55%,color-mix(in_oklab,var(--background)_70%,transparent))]" />
      </div>

      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Projects />
        <Pricing />
        <Process />
        <About />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <ChatLauncher />
    </div>
  );
}
