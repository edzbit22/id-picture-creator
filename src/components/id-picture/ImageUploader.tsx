'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export function ImageUploader() {
  const { sourceImage, setSourceImage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setSourceImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setSourceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setSourceImage]);

  if (sourceImage) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              Step 1: Image Uploaded
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-24 rounded-lg overflow-hidden border bg-muted">
            <img
              src={sourceImage}
              alt="Uploaded"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </Button>
        </CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Upload className="h-4 w-4 text-emerald-600" />
          Step 1: Upload Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-muted-foreground/25 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            JPG, PNG, or WebP
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
