'use client';

import { useAppStore } from '@/store/useAppStore';
import { PAPER_SIZES } from '@/utils/constants';
import { calculatePaperLayout } from '@/utils/paperLayout';
import { DEFAULT_MARGINS } from '@/utils/constants';
import { FileText } from 'lucide-react';

export function LayoutPreview() {
  const {
    processedImage,
    selectedSize,
    customWidth,
    customHeight,
    quantity,
    paperSize,
  } = useAppStore();

  const paper = PAPER_SIZES[paperSize];
  const pictureWidthInches = selectedSize.id === 'custom' ? customWidth : selectedSize.width;
  const pictureHeightInches = selectedSize.id === 'custom' ? customHeight : selectedSize.height;

  const layout = calculatePaperLayout(
    pictureWidthInches,
    pictureHeightInches,
    quantity,
    paperSize,
    undefined,
    DEFAULT_MARGINS
  );

  // Scale factor: fit paper within the preview area
  const previewMaxWidth = 500;
  const previewMaxHeight = 400;
  const scaleW = previewMaxWidth / paper.width;
  const scaleH = previewMaxHeight / paper.height;
  const scale = Math.min(scaleW, scaleH);

  const previewWidth = paper.width * scale;
  const previewHeight = paper.height * scale;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-sm">Paper Layout Preview</h3>
      </div>

      <div className="flex items-center justify-center p-4 bg-muted/30 rounded-xl">
        <div
          className="bg-white shadow-lg border border-gray-200 relative"
          style={{
            width: previewWidth,
            height: previewHeight,
          }}
        >
          {/* Margin indicator */}
          <div
            className="absolute border border-dashed border-emerald-300"
            style={{
              left: DEFAULT_MARGINS.left * scale,
              top: DEFAULT_MARGINS.top * scale,
              right: DEFAULT_MARGINS.right * scale,
              bottom: DEFAULT_MARGINS.bottom * scale,
            }}
          />

          {/* Picture placeholders */}
          {layout.positions.map((pos, idx) => (
            <div
              key={idx}
              className="absolute border border-emerald-400/50 overflow-hidden"
              style={{
                left: pos.x * scale,
                top: pos.y * scale,
                width: pos.width * scale,
                height: pos.height * scale,
              }}
            >
              {processedImage ? (
                <img
                  src={processedImage}
                  alt={`Copy ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-[8px] text-emerald-600 font-mono">
                    {idx + 1}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Paper size label */}
          <div className="absolute bottom-1 right-1 text-[8px] text-gray-400 font-mono bg-white/80 px-1 rounded">
            {paper.label}
          </div>
        </div>
      </div>

      {/* Layout details */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-lg font-bold text-emerald-600">{layout.cols}</p>
          <p className="text-[10px] text-muted-foreground">Columns</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-lg font-bold text-emerald-600">{layout.rows}</p>
          <p className="text-[10px] text-muted-foreground">Rows</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-lg font-bold text-emerald-600">{quantity}</p>
          <p className="text-[10px] text-muted-foreground">Copies</p>
        </div>
      </div>
    </div>
  );
}
