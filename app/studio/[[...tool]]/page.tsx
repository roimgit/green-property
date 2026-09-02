/**
 * Embedded Sanity Studio route.
 * Accessible at /studio in the same Next.js app.
 */
import Studio from "./Studio";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
