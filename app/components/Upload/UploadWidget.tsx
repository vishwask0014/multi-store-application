"use client";

import { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UploadIcon, Cancel01Icon, ImageIcon } from "@hugeicons/core-free-icons";

interface UploadWidgetProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number;
  label?: string;
}

const CLOUD_NAME = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : "";
const UPLOAD_PRESET = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET : "";

export default function UploadWidget({
  onUpload,
  onRemove,
  currentUrl,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  label = "Upload Image",
}: UploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError("");

    if (file.size > maxSize) {
      setError(`File too large. Max ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onUpload(reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onUpload(data.secure_url);
      } else {
        setError("Upload failed");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("Upload failed");
    };

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="group relative inline-block overflow-hidden rounded-lg ring-1 ring-border/30">
          <img src={currentUrl} alt="" className="h-24 w-24 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30"
            >
              <HugeiconsIcon icon={ImageIcon} size={14} />
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="rounded-lg bg-danger/60 p-1.5 text-white transition-colors hover:bg-danger"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border/50 bg-base px-6 py-8 text-center transition-colors hover:border-primary/40"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs text-text-muted">{progress}%</span>
              {progress > 0 && (
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <HugeiconsIcon icon={UploadIcon} size={24} className="text-text-muted" />
              <div>
                <p className="text-sm text-text-primary">{label}</p>
                <p className="text-xs text-text-muted">Click or drag to upload</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
