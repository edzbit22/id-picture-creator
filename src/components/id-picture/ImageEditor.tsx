'use client';

import Cropper from 'react-easy-crop';
import { useImageEditor } from '@/hooks/useImageEditor';
import { Crop } from 'lucide-react';

export function ImageEditor() {
  const {
    sourceImage,
    zoom,
    rotation,
    aspectRatio,
    crop,
    onCropChange,
    onCropComplete,
    onZoomChange,
  } = useImageEditor();

  if (!sourceImage) {
    return null;
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <Crop className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium text-muted-foreground">
          Drag to position, use sidebar controls to adjust
        </span>
      </div>
      <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-black/90 shadow-inner">
        <Cropper
          image={sourceImage}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
          cropShape="rect"
          showGrid={false}
          style={{
            containerStyle: { borderRadius: '0.75rem' },
            mediaStyle: { filter: 'auto' },
            cropAreaStyle: { border: '2px solid rgba(16, 185, 129, 0.6)' },
          }}
        />
      </div>
    </div>
  );
}
