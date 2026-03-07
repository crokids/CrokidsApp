/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function ImageUpload({ value, onChange }: Props) {
  return (
    <div className="space-y-4">

      {/* PREVIEW */}
      {value && (
        <div className="relative w-40">
          <Image
            src={value}
            alt="preview"
            width={160}
            height={160}
            className="rounded-md border object-cover"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2"
            onClick={() => onChange("")}
          >
            <Trash size={14} />
          </Button>
        </div>
      )}

      {/* BOTÃO UPLOAD */}

      <CldUploadWidget
        uploadPreset="products"
        onUpload={(result: any) => {
          onChange(result.info.secure_url);
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            onClick={() => open()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload imagem
          </Button>
        )}
      </CldUploadWidget>

    </div>
  );
}