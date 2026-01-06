import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Storage for user profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "realEstateApp/users",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Storage for property images
const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "realEstateApp/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
  },
});

// Storage for category icons
const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "realEstateApp/categories",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [{ width: 200, height: 200, crop: "limit" }],
  },
});

// Multer instances
export const upload = multer({ storage: profileStorage });
export const uploadPropertyImages = multer({
  storage: propertyStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files
  },
});
export const uploadCategoryIcon = multer({ storage: categoryStorage });

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Export with filter
export const uploadWithFilter = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
});