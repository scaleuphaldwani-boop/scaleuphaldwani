import { defineTool } from "@lovable.dev/mcp-js";
import { projects } from "@/data/projects";

export default defineTool({
  name: "list_projects",
  title: "List portfolio projects",
  description:
    "List every video project in the Scaleup Haldwani portfolio with title, description, tags, role, year and video URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const items = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      role: p.role,
      year: p.date,
      orientation: p.vertical ? "vertical" : "widescreen",
      video: p.video,
      poster: p.poster,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { projects: items },
    };
  },
});