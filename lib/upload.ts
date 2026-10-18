// Upload rules shared by the browser uploader and the /api/parse route.
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Returns a user-facing error message, or null if the file is acceptable. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPEG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "That image is larger than 8 MB. Try a smaller photo.";
  }
  return null;
}
