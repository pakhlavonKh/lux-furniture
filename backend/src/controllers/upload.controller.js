// backend/src/controllers/upload.controller.js
import cloudinary from "../config/cloudinary.js";

export const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "manaku/products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);

              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          );

          stream.end(file.buffer);
        })
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json(results);
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};