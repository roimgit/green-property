/**
 * Embedded Sanity Studio route.
 * Accessible at /studio in the same Next.js app.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
