import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import getPricing from "./tools/get-pricing";
import getContact from "./tools/get-contact";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "scaleup-vision-studio",
  title: "ScaleUp Vision Studio",
  version: "0.1.0",
  instructions:
    "Tools for the Scaleup Haldwani video editing and cinematography portfolio. Use `list_projects` for the reel/film showcase, `get_pricing` for package rates, and `get_contact` for booking details.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProjects, getPricing, getContact],
});