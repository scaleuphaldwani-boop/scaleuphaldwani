import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const contact = {
  studio: "Scaleup Haldwani",
  services: [
    "Video editing (CapCut Pro, Premiere Pro, After Effects)",
    "Cinematography and on-location shoots",
    "Short-form reels, brand films, product ads",
  ],
  email: "scaleuphaldwani@gmail.com",
  phones: ["+91 9105456076", "+91 9837787246"],
  whatsapp: "https://wa.me/919105456076",
  website: "https://scaleuphaldwani.lovable.app",
};

export default defineTool({
  name: "get_contact",
  title: "Get contact details",
  description:
    "Return Scaleup Haldwani's contact details and the services offered, for booking or enquiry follow-up.",
  inputSchema: {},
  outputSchema: {
    studio: z.string(),
    services: z.array(z.string()),
    email: z.string(),
    phones: z.array(z.string()),
    whatsapp: z.string(),
    website: z.string(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
      structuredContent: contact,
    };
  },
});