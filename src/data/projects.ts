import pf from "@/assets/project-foodcart.mp4.asset.json";
import p1 from "@/assets/project-1.mp4.asset.json";
import p2 from "@/assets/project-2.mp4.asset.json";
import p3 from "@/assets/project-3.mp4.asset.json";
import p4 from "@/assets/project-4.mp4.asset.json";
import p5 from "@/assets/project-5.mp4.asset.json";
import p6 from "@/assets/project-6.mp4.asset.json";
import p7 from "@/assets/project-7.mp4.asset.json";
import cf from "@/assets/poster-foodcart.jpg.asset.json";
import c1 from "@/assets/poster-1.jpg.asset.json";
import c2 from "@/assets/poster-2.jpg.asset.json";
import c3 from "@/assets/poster-3.jpg.asset.json";
import c4 from "@/assets/poster-4.jpg.asset.json";
import c5 from "@/assets/poster-5.jpg.asset.json";
import c6 from "@/assets/poster-6.jpg.asset.json";
import c7 from "@/assets/poster-7.jpg.asset.json";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  role: string;
  date: string;
  video: string;
  poster: string;
  vertical: boolean;
};

export const projects: Project[] = [
  {
    id: "p6",
    title: "Golden Hour Brand Film",
    description:
      "Shot handheld at golden hour and cut for mood — warm cinematic grade, breathing pace and sound-led transitions that let the frame do the talking.",
    tags: ["Cinematography", "Colour Grade", "Premiere Pro"],
    role: "DOP & Editor",
    date: "2026",
    video: p6.url,
    poster: c6.url,
    vertical: true,
  },
  {
    id: "p2",
    title: "Widescreen Story Edit",
    description:
      "A long-form landscape cut built around a narrative spine: J-cuts, motion-tracked titles in After Effects and a clean, contrast-rich finish.",
    tags: ["Story Edit", "After Effects", "Titles"],
    role: "Lead Editor",
    date: "2026",
    video: p2.url,
    poster: c2.url,
    vertical: false,
  },
  {
    id: "p5",
    title: "High-Retention Reel",
    description:
      "Beat-synced vertical reel engineered for retention — hard hook in the first second, snap zooms, whip transitions and punchy CapCut Pro sound design.",
    tags: ["Reels", "CapCut Pro", "Sound Design"],
    role: "Editor",
    date: "2026",
    video: p5.url,
    poster: c5.url,
    vertical: true,
  },
  {
    id: "p7",
    title: "Product Spotlight Cut",
    description:
      "Tight vertical product spot with macro detail inserts, speed ramps and a crisp commercial grade made to convert on paid placements.",
    tags: ["Ad Edit", "Speed Ramps", "Grade"],
    role: "Editor",
    date: "2026",
    video: p7.url,
    poster: c7.url,
    vertical: true,
  },
  {
    id: "p1",
    title: "Vertical Montage",
    description:
      "Rhythm-first montage stitched from handheld coverage, cut on transients with subtle grain and halation for a filmic texture.",
    tags: ["Montage", "Premiere Pro"],
    role: "Editor",
    date: "2025",
    video: p1.url,
    poster: c1.url,
    vertical: true,
  },
  {
    id: "p3",
    title: "Lifestyle Vertical Edit",
    description:
      "Warm lifestyle cut with soft-light grading, layered ambience and text beats timed to the track for social-first delivery.",
    tags: ["Lifestyle", "Social", "Grade"],
    role: "Editor",
    date: "2025",
    video: p3.url,
    poster: c3.url,
    vertical: true,
  },
  {
    id: "p4",
    title: "Quick Hook Teaser",
    description:
      "A twenty-second teaser built as pure hook — kinetic typography, sharp cuts and a loop-friendly ending that keeps replays climbing.",
    tags: ["Teaser", "Kinetic Type"],
    role: "Editor",
    date: "2025",
    video: p4.url,
    poster: c4.url,
    vertical: true,
  },
];