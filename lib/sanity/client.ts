import { createClient } from "next-sanity";
import type { QueryParams } from "next-sanity";
import groq from "groq";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = "2024-06-01";

/**
 * Public/browser-safe client (read-only, no token, uses CDN).
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Server-only client with a write token.
 * Use in API routes / server actions to mutate data. Never expose the token
 * to the browser — importing this module with SANITY_API_TOKEN set and then
 * importing it in a client component will leak the token.
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Helper to run a GROQ query with proper typings.
 */
export async function sanityFetch<QueryResult>(
  query: string,
  params: QueryParams = {},
) {
  return client.fetch<QueryResult>(query, params);
}

export { groq };
