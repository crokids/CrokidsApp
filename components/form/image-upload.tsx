"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export function ImageUpload({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    try {
      setPreview(URL.createObjectURL(file));
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      console.log("cloudinary:", data);

      if (!res.ok) throw new Error(data.error?.message);

      onChange(data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar imagem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-48">
          <Image
            src={preview}
            alt="preview"
            width={200}
            height={200}
            className="rounded-md border object-cover"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2"
            onClick={() => {
              setPreview(null);
              onChange("");
            }}
          >
            <Trash size={14} />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted">
          <Upload className="w-6 h-6 mb-2" />

          <p className="text-sm text-muted-foreground">
            Clique para enviar imagem
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (!e.target.files) return;
              handleUpload(e.target.files[0]);
            }}
          />
        </label>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Enviando imagem...</p>
      )}
    </div>
  );
}
