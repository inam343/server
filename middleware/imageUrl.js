/**
 * Returns the public-relative image URL from a multer file object.
 * Example output: "/productitems/1720000000000-123456789.jpg"
 *
 * Works by stripping the FRONTEND_PUBLIC_PATH prefix from file.destination.
 * If the env var is not set (production with separate filesystems) it falls
 * back to "/uploads/<filename>" — the backend still serves that route.
 */
function imageUrl(file) {
  if (!file) return null;

  const publicBase = process.env.FRONTEND_PUBLIC_PATH;
  if (publicBase) {
    // Normalize both paths to forward slashes for comparison
    const dest = file.destination.replace(/\\/g, "/");
    const base = publicBase.replace(/\\/g, "/");
    const relative = dest.replace(base, "");
    return `${relative}/${file.filename}`;
  }

  // Fallback when not sharing filesystem (e.g. Railway deployment)
  return `/uploads/${file.filename}`;
}

module.exports = imageUrl;
