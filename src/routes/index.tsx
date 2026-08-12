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
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Pricing />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
}
