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
    id: "food",
    title: "Vintage Carnival Food Cart",
    description:
      "A POV street-food reel for Haldwani's Vintage Carnival — neon-lit night footage, sizzling sound design and hunger-inducing macro inserts cut tight to the beat.",
    tags: ["Food Reel", "POV", "Sound Design"],
    role: "Shoot & Edit",
    date: "2026",
    video: pf.url,
    poster: cf.url,
    vertical: true,
  },
  {
    id: "p5",
    title: "Car Showroom Walkthrough",
    description:
      "Showroom feature piece built around a presenter walk-and-talk — clean speed ramps around the car, reflective highlight grade and punchy on-screen titles.",
    tags: ["Showroom", "Presenter", "Premiere Pro"],
    role: "DOP & Editor",
    date: "2026",
    video: p5.url,
    poster: c5.url,
    vertical: true,
  },
  {
    id: "p4",
    title: "Mocktail Bar Cut",
    description:
      "Moody low-light mocktail edit — slow-motion pours, glassware close-ups and ambience-led sound design finished with a rich, contrasty grade.",
    tags: ["Beverage", "Slow Motion", "Grade"],
    role: "Editor",
    date: "2026",
    video: p4.url,
    poster: c4.url,
    vertical: true,
  },
  {
    id: "p6",
    title: "Hills Ride Bike Film",
    description:
      "A lakeside motorcycle film shot in the hills — handheld ride coverage, engine-led audio and a cool cinematic grade that leans into the mountain light.",
    tags: ["Cinematography", "Travel", "Colour Grade"],
    role: "DOP & Editor",
    date: "2026",
    video: p6.url,
    poster: c6.url,
    vertical: true,
  },
  {
    id: "p1",
    title: "School Campus Promo",
    description:
      "Bright campus promo for an activity-based learning school — colour-popped exteriors, kinetic titles and an upbeat cut aimed at parents.",
    tags: ["Promo", "Kinetic Type", "Premiere Pro"],
    role: "Editor",
    date: "2025",
    video: p1.url,
    poster: c1.url,
    vertical: true,
  },
  {
    id: "p2",
    title: "Aerial Campus Story",
    description:
      "Widescreen drone-led story edit — sweeping aerial reveals of the campus, motion-tracked titles in After Effects and a clean, contrast-rich finish.",
    tags: ["Drone", "After Effects", "Story Edit"],
    role: "Lead Editor",
    date: "2025",
    video: p2.url,
    poster: c2.url,
    vertical: false,
  },
  {
    id: "p3",
    title: "Black & White Classroom Film",
    description:
      "A monochrome classroom portrait piece — documentary framing, quiet ambience and a high-contrast black and white grade for a timeless feel.",
    tags: ["Documentary", "Monochrome", "Grade"],
    role: "Editor",
    date: "2025",
    video: p3.url,
    poster: c3.url,
    vertical: true,
  },
  {
    id: "p7",
    title: "Carnival Teaser Cut",
    description:
      "The short teaser version of the carnival shoot — pure hook, sharp cuts and a loop-friendly ending built to keep replays climbing.",
    tags: ["Teaser", "Kinetic Type"],
    role: "Editor",
    date: "2025",
    video: p7.url,
    poster: c7.url,
    vertical: true,
  },
];