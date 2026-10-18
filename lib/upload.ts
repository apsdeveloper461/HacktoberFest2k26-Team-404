// Upload rules shared by the browser uploader and the /api/parse route.
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Browser side: photos bigger than this are downscaled before upload. */
export const UPLOAD_MAX_EDGE = 1600;
const UPLOAD_KEEP_BYTES = 1.5 * 1024 * 1024;
/** Browser side: larger raw photos are accepted because they get resized first. */
const MAX_PICK_BYTES = 40 * 1024 * 1024;

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

/**
 * Browser-side check when a photo is picked. Allows big phone photos, since
 * prepareImageForUpload() shrinks them; the server still enforces 8 MB.
 */
export function validatePickedImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPEG, or WebP image.";
  }
  if (file.size > MAX_PICK_BYTES) {
    return "That image is larger than 40 MB. Try a smaller photo.";
  }
  return null;
}

/** True when prepareImageForUpload() will re-encode this photo. */
export function needsResize(width: number, height: number, bytes: number) {
  return Math.max(width, height) > UPLOAD_MAX_EDGE || bytes > UPLOAD_KEEP_BYTES;
}

/**
 * Browser only. Downscales to a 1600px long edge and re-encodes as JPEG (0.85),
 * respecting EXIF rotation. Returns the original file when it is already small
 * enough, or if anything fails, so the upload never gets worse.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = bitmap;
    if (!needsResize(width, height, file.size)) return file;

    const scale = Math.min(1, UPLOAD_MAX_EDGE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    // JPEG has no alpha: flatten transparent PNGs onto white, like paper.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return file;
    // Shrunk only for bytes (dimensions already fine) but JPEG came out bigger:
    // the original was the better upload after all.
    if (scale === 1 && blob.size >= file.size) return file;

    const name = `${file.name.replace(/\.[^.]+$/, "")}.jpg`;
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}

/** "2.4 MB" / "640 KB" — for showing the picked file's size. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
