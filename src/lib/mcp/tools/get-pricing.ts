import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const packages = [
  {
    name: "Reels & Edits",
    startingPrice: "₹1,500",
    highlights: ["Edit-only", "Sound design", "Colour grade", "48h turnaround"],
  },
  {
    name: "Shoot + Edit",
    startingPrice: "₹8,000",
    featured: true,
    highlights: ["On-location shoot", "Multi-cam edit", "Motion graphics", "Final reel exports"],
  },
  {
    name: "Monthly Retainer",
    startingPrice: "₹22,000/mo",
    highlights: [
      "Recurring monthly shoot",
      "10–12 reels",
      "Priority delivery",
      "Dedicated edit pipeline",
    ],
  },
];

export default defineTool({
  name: "get_pricing",
  title: "Get pricing packages",
  description: "Return the Scaleup Haldwani pricing packages, starting rates and what each includes.",
  inputSchema: {},
  outputSchema: { packages: z.array(z.record(z.string(), z.unknown())) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(packages, null, 2) }],
      structuredContent: { packages },
    };
  },
});