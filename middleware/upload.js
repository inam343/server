const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Resolve the destination folder inside the Next.js public directory.
 *
 * Rules:
 *  - categories (top category / banners)  → /catimages/
 *  - products (productrow, featured, breakfast, slider) → /productitems/
 *  - slides (productslider)               → /productitems/
 *
 * The base public path is read from the FRONTEND_PUBLIC_PATH env variable
 * so it works on any machine without hard-coding a path.
 * Falls back to a local ./uploads folder if the env var is not set
 * (e.g. on the production server where both apps don't share a filesystem).
 */

function getPublicBase() {
  if (process.env.FRONTEND_PUBLIC_PATH) {
    return process.env.FRONTEND_PUBLIC_PATH;
  }
  // fallback: own uploads folder
  return path.join(__dirname, "../uploads");
}

function getSubfolder(req) {
  const url = req.originalUrl || "";
  if (url.includes("/api/categories")) return "catimages";
  // productslider, productrow, featuredproduct, breakfast all go to productitems
  return "productitems";
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subfolder = getSubfolder(req);
    const dest = path.join(getPublicBase(), subfolder);

    // Create the folder if it doesn't exist yet
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },

  filename: function (req, file, cb) {
    // Use a timestamp + random number to avoid name collisions
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
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
