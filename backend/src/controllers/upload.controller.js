// backend/src/controllers/upload.controller.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const results = files.map((file) => {
      // Generate unique filename
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return file info
      return {
        url: `/uploads/${uniqueName}`,
        public_id: uniqueName,
        originalName: file.originalname,
        size: file.size,
      };
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};