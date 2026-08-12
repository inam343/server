const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Saves uploaded images directly into the Next.js public folder:
 *   /api/categories  → public/catimages/
 *   everything else  → public/productitems/
 *
 * FRONTEND_PUBLIC_PATH must use forward slashes in .env on Windows, e.g.:
 *   FRONTEND_PUBLIC_PATH=C:/Users/dell/.../grocerystore/public
 */

function getPublicBase() {
  const raw = process.env.FRONTEND_PUBLIC_PATH;
  if (raw) {
    // Normalize: replace any accidental backslashes, trim trailing slash
    return raw.replace(/\\/g, "/").replace(/\/$/, "");
  }
  // Fallback: save inside the backend's own uploads/ folder
  return path.join(__dirname, "../uploads").replace(/\\/g, "/");
}

function getSubfolder(req) {
  const url = req.originalUrl || "";
  if (url.includes("/api/categories")) return "catimages";
  return "productitems";
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const base = getPublicBase();
    const subfolder = getSubfolder(req);
    // path.join handles the OS-specific separator correctly
    const dest = path.join(base, subfolder);

    console.log("[upload] saving image to:", dest);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },

  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk  = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
