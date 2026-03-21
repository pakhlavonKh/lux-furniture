import { useState, useCallback, memo } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImages, type ProductImage } from "@/lib/api";

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  multiple?: boolean;
  label?: string;
}

interface PendingImage {
  id: string;
  preview: string;
  file: File;
  uploading: boolean;
  error?: string;
}

function ImageUploaderInner({
  images,
  onChange,
  multiple = true,
  label = "Images",
}: ImageUploaderProps) {
  const [pending, setPending] = useState<PendingImage[]>([]);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const toUpload = multiple ? files : [files[files.length - 1]];

    const newPending: PendingImage[] = toUpload.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      file,
      uploading: true,
    }));

    setPending((prev) => (multiple ? [...prev, ...newPending] : newPending));

    try {
      const uploaded = await uploadImages(toUpload);

      const newImages = uploaded.map((img, i) => ({
        ...img,
        isPrimary: images.length === 0 && i === 0,
      }));

      const nextImages = multiple ? [...images, ...newImages] : newImages;
      onChange(nextImages);

      newPending.forEach((p) => URL.revokeObjectURL(p.preview));
      setPending((prev) =>
        prev.filter((p) => !newPending.some((np) => np.id === p.id))
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Upload failed";

      setPending((prev) =>
        prev.map((p) =>
          newPending.some((np) => np.id === p.id)
            ? { ...p, uploading: false, error: errorMsg }
            : p
        )
      );
    }
  }, [images, onChange, multiple]);

  const removeImage = useCallback((index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length && !next.some((img) => img.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
  }, [images, onChange]);

  const setPrimary = useCallback((index: number) => {
    const next = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(next);
  }, [images, onChange]);

  const removePending = useCallback((id: string) => {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return (
    <div className="image-uploader">
      <label className="image-uploader-label">{label}</label>

      <div className="image-grid">
        {/* Uploaded */}
        {images.map((img, i) => (
          <div
            key={img.public_id || i}
            className={`image-item ${img.isPrimary ? "primary" : ""}`}
          >
            <img 
              src={img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_URL}${img.url}`}
              alt={img.alt || "Product"}
              className="image-img"
              crossOrigin="anonymous"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error('Image failed to load:', img.url, 'Error: Unknown error');
                target.style.opacity = '0.5';
                target.style.filter = 'grayscale(1)';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', img.url);
              }}
            />

            <div className="image-overlay">
              {multiple && (
                <button
                  onClick={() => setPrimary(i)}
                  className="image-btn image-btn-primary"
                >
                  ★
                </button>
              )}

              <button
                onClick={() => removeImage(i)}
                className="image-btn image-btn-danger"
              >
                <X size={12} />
              </button>
            </div>

            {img.isPrimary && (
              <span className="image-primary-badge">Primary</span>
            )}
          </div>
        ))}

        {/* Pending */}
        {pending.map((p) => (
          <div key={p.id} className="image-pending">
            <img src={p.preview} />

            <div className="image-pending-center">
              {p.uploading ? (
                <Loader2 size={20} />
              ) : (
                <button onClick={() => removePending(p.id)}>
                  {p.error} ✕
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Upload */}
        {(multiple || images.length === 0) && (
          <label className="image-upload">
            <Upload size={18} />
            <span className="image-upload-text">Upload</span>

            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              hidden
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

export const ImageUploader = memo(ImageUploaderInner);