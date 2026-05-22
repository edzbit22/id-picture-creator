'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { exportToDocx } from '@/services/docxExport';
import { exportToPdf, exportToPng } from '@/services/pdfExport';
import { calculatePaperLayout } from '@/utils/paperLayout';
import { DEFAULT_MARGINS } from '@/utils/constants';

export type ExportFormat = 'docx' | 'pdf' | 'png';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    processedImage,
    selectedSize,
    customWidth,
    customHeight,
    paperSize,
    quantity,
  } = useAppStore();

  const pictureWidthInches = selectedSize.id === 'custom' ? customWidth : selectedSize.width;
  const pictureHeightInches = selectedSize.id === 'custom' ? customHeight : selectedSize.height;

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!processedImage) {
        setExportError('No processed image available. Please crop your image first.');
        return;
      }

      setIsExporting(true);
      setExportError(null);

      try {
        switch (format) {
          case 'docx': {
            const layout = calculatePaperLayout(
              pictureWidthInches,
              pictureHeightInches,
              quantity,
              paperSize,
              undefined,
              DEFAULT_MARGINS
            );
            await exportToDocx(
              processedImage,
              layout.positions,
              pictureWidthInches,
              pictureHeightInches,
              paperSize
            );
            break;
          }
          case 'pdf': {
            const layout = calculatePaperLayout(
              pictureWidthInches,
              pictureHeightInches,
              quantity,
              paperSize,
              undefined,
              DEFAULT_MARGINS
            );
            await exportToPdf(processedImage, layout.positions, paperSize);
            break;
          }
          case 'png': {
            await exportToPng(processedImage);
            break;
          }
        }
      } catch (error) {
        console.error('Export error:', error);
        setExportError(error instanceof Error ? error.message : 'Export failed');
      } finally {
        setIsExporting(false);
      }
    },
    [processedImage, pictureWidthInches, pictureHeightInches, quantity, paperSize]
  );

  return {
    isExporting,
    exportError,
    handleExport,
    canExport: !!processedImage,
  };
}
