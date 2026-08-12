const path = require("path");

/**
 * Returns the public-relative image URL from a multer file object.
 * Example output: "/productitems/1720000000000-123456789.jpg"
 *
 * Uses path.relative() instead of string replace — works correctly on
 * Windows regardless of backslash/forward-slash mix in env vars.
 */
function imageUrl(file) {
  if (!file) return null;

  const publicBase = process.env.FRONTEND_PUBLIC_PATH;

  if (publicBase) {
    // path.relative gives us e.g. "productitems\1720000000-123.jpg" on Windows
    const rel = path.relative(publicBase, path.join(file.destination, file.filename));
    // Convert backslashes → forward slashes and prepend /
    return "/" + rel.replace(/\\/g, "/");
  }

  // Fallback: backend serves /uploads/ statically
  return `/uploads/${file.filename}`;
}

module.exports = imageUrl;
