import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Storage bucket used for property photos.
 * Create it in the Supabase dashboard (Storage > New bucket) with the name
 * below, set to "Public" if images must be publicly accessible:
 *   name: "property-photos"
 */
export const PROPERTY_PHOTOS_BUCKET = "property-photos";

export type PropertyPhotoClient = SupabaseClient | Awaited<ReturnType<typeof createClient>>;

/**
 * Uploads a property photo to the given bucket path.
 * Returns the full public URL of the uploaded file on success.
 */
export async function uploadPropertyPhoto(
  supabase: PropertyPhotoClient,
  filePath: string,
  fileBody: Blob | ArrayBuffer | string,
  contentType: string,
) {
  const { error } = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .upload(filePath, fileBody, { contentType });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return getPublicUrl(supabase, filePath);
}

/** Returns the public URL for a file in the property-photos bucket. */
export function getPublicUrl(
  supabase: PropertyPhotoClient,
  filePath: string,
): string {
  const { data } = supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

/** Deletes one or more files from the property-photos bucket. */
export async function deletePropertyPhotos(
  supabase: PropertyPhotoClient,
  filePaths: string[],
) {
  const { error } = await supabase.storage
    .from(PROPERTY_PHOTOS_BUCKET)
    .remove(filePaths);

  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`);
  }
}
