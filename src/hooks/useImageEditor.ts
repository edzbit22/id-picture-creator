'use client';

import { useCallback } from 'react';
import type { Area, Point } from 'react-easy-crop';
import { useAppStore } from '@/store/useAppStore';
import { processIdPicture } from '@/utils/imageProcessing';
import { calculatePaperLayout } from '@/utils/paperLayout';
import { DEFAULT_MARGINS } from '@/utils/constants';

export function useImageEditor() {
  const {
    sourceImage,
    zoom,
    rotation,
    flipH,
    flipV,
    selectedSize,
    customWidth,
    customHeight,
    backgroundColor,
    removeBackground,
    bgThreshold,
    croppedAreaPixels,
    paperSize,
    quantity,
    crop,
    setCrop,
    setCroppedAreaPixels,
    setProcessedImage,
    setLayoutPositions,
  } = useAppStore();

  const pictureWidthInches = selectedSize.id === 'custom' ? customWidth : selectedSize.width;
  const pictureHeightInches = selectedSize.id === 'custom' ? customHeight : selectedSize.height;

  const aspectRatio = pictureHeightInches > 0 ? pictureWidthInches / pictureHeightInches : 1;

  const onCropChange = useCallback(
    (location: Point) => {
      setCrop(location);
    },
    [setCrop]
  );

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [setCroppedAreaPixels]
  );

  const onZoomChange = useCallback(
    (z: number) => {
      useAppStore.getState().setZoom(z);
    },
    []
  );

  const processAndGeneratePreview = useCallback(async () => {
    if (!sourceImage || !croppedAreaPixels) return;

    try {
      const result = await processIdPicture(
        sourceImage,
        croppedAreaPixels,
        pictureWidthInches,
        pictureHeightInches,
        rotation,
        flipH,
        flipV,
        backgroundColor === 'transparent' ? null : backgroundColor,
        removeBackground,
        bgThreshold
      );

      setProcessedImage(result);

      // Calculate layout positions
      const layout = calculatePaperLayout(
        pictureWidthInches,
        pictureHeightInches,
        quantity,
        paperSize,
        undefined,
        DEFAULT_MARGINS
      );

      setLayoutPositions(layout.positions);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }, [
    sourceImage,
    croppedAreaPixels,
    pictureWidthInches,
    pictureHeightInches,
    rotation,
    flipH,
    flipV,
    backgroundColor,
    removeBackground,
    bgThreshold,
    quantity,
    paperSize,
    setProcessedImage,
    setLayoutPositions,
  ]);

  return {
    sourceImage,
    zoom,
    rotation,
    flipH,
    flipV,
    aspectRatio,
    pictureWidthInches,
    pictureHeightInches,
    crop: crop ?? { x: 0, y: 0 },
    onCropChange,
    onCropComplete,
    onZoomChange,
    processAndGeneratePreview,
    croppedAreaPixels,
  };
}
