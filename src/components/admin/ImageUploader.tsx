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

function ImageUploaderInner({ images, onChange, multiple = true, label = "Images" }: ImageUploaderProps) {
  const [pending, setPending] = useState<PendingImage[]>([]);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    // If single mode, take only the last file
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

      // Map uploaded results to ProductImage and mark first as primary if none exist
      const newImages = uploaded.map((img, i) => ({
        ...img,
        isPrimary: images.length === 0 && i === 0,
      }));

      const nextImages = multiple ? [...images, ...newImages] : newImages;
      onChange(nextImages);

      // Revoke object URLs
      newPending.forEach((p) => URL.revokeObjectURL(p.preview));
      setPending((prev) => prev.filter((p) => !newPending.some((np) => np.id === p.id)));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed - check console for details";
      console.error("Image upload error:", error);
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
    // If we removed the primary, make first one primary
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
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
    <div>
      <label className="text-caption mb-2 block font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {/* Uploaded images */}
        {images.map((img, i) => (
          <div
            key={img.public_id || i}
            className={`relative group w-24 h-24 rounded border-2 overflow-hidden ${
              img.isPrimary ? "border-blue-500" : "border-border"
            }`}
          >
            <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {multiple && (
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  className="text-[10px] text-white bg-blue-600 px-1.5 py-0.5 rounded"
                  title="Set as primary"
                >
                  ★
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="p-1 bg-red-600 rounded"
                title="Remove"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
            {img.isPrimary && (
              <span className="absolute top-0.5 left-0.5 text-[9px] bg-blue-500 text-white px-1 rounded">
                Primary
              </span>
            )}
          </div>
        ))}

        {/* Pending uploads */}
        {pending.map((p) => (
          <div key={p.id} className="relative w-24 h-24 rounded border-2 border-dashed border-border overflow-hidden">
            <img src={p.preview} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              {p.uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-foreground" />
              ) : p.error ? (
                <button type="button" onClick={() => removePending(p.id)} className="text-xs text-red-500 px-2 text-center">
                  {p.error} ✕
                </button>
              ) : null}
            </div>
          </div>
        ))}

        {/* Upload button */}
        {(multiple || images.length === 0) && (
          <label className="w-24 h-24 rounded border-2 border-dashed border-border hover:border-foreground/40 transition-colors flex flex-col items-center justify-center cursor-pointer gap-1">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
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
