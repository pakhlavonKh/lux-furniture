import { readdirSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all image files recursively from frontend assets
function getAllImages(dir, fileList = []) {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      getAllImages(fullPath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

async function copyAssetsToBackend() {
  try {
    const assetsPath = join(__dirname, "../../../src/assets");
    const uploadsPath = join(__dirname, "../../uploads");

    // Get all image files
    const imageFiles = getAllImages(assetsPath);

    console.log(`Found ${imageFiles.length} image files in frontend assets\n`);

    // Ensure uploads folder exists
    try {
      mkdirSync(uploadsPath, { recursive: true });
    } catch (e) {
      // folder already exists
    }

    let copiedCount = 0;
    for (const source of imageFiles) {
      try {
        const filename = source.split("/").pop();
        const destination = join(uploadsPath, filename);
        copyFileSync(source, destination);
        copiedCount++;

        if (copiedCount % 50 === 0) {
          console.log(`✓ Copied ${copiedCount}/${imageFiles.length} files...`);
        }
      } catch (err) {
        // Skip files that couldn't be copied
        continue;
      }
    }

    console.log(`\n✅ Successfully copied ${copiedCount} image files to backend/uploads/`);
    console.log(`   Total images available: ${copiedCount}`);

  } catch (error) {
    console.error("\n✗ Copy failed:", error.message);
    process.exit(1);
  }
}

copyAssetsToBackend();
