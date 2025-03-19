import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../cloudinary";
const cloudinary = require("@/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "products",
    format: file.mimetype.split("/")[1],
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

export default upload;
