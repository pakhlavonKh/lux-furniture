// backend/src/middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },

  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads allowed"));
    }

    cb(null, true);
  },
});

export default upload;