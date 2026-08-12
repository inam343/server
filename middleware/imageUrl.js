const path = require("path");

/**
 * Converts a multer file object into a public-relative URL path.
 *
 * Input  (Windows example):
 *   file.destination = "C:\Users\dell\...\grocerystore\public\productitems"
 *   file.filename    = "1720000000000-123456789.jpg"
 *
 * Output:
 *   "/productitems/1720000000000-123456789.jpg"
 *
 * This path is stored in MongoDB and used directly as <img src> in Next.js
 * because Next.js serves everything in /public at the root URL.
 */
function imageUrl(file) {
  if (!file) return null;

  const raw = process.env.FRONTEND_PUBLIC_PATH;

  if (raw) {
    // Normalize the public base (forward slashes, no trailing slash)
    const base = raw.replace(/\\/g, "/").replace(/\/$/, "");

    // Build full path of the saved file, normalize to forward slashes
    const full = path.join(file.destination, file.filename).replace(/\\/g, "/");

    // Strip the base prefix → "/productitems/filename.jpg"
    const relative = full.replace(base, "");

    console.log("[imageUrl] base:", base);
    console.log("[imageUrl] full:", full);
    console.log("[imageUrl] saved as:", relative);

    return relative;
  }

  // Fallback when FRONTEND_PUBLIC_PATH is not set (e.g. production server)
  return `/uploads/${file.filename}`;
}

module.exports = imageUrl;
