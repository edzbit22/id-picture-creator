import { PRINT_DPI, INCH_TO_EMU } from './constants';

/**
 * Convert inches to pixels at the given DPI
 */
export function inchesToPixels(inches: number, dpi: number = PRINT_DPI): number {
  return Math.round(inches * dpi);
}

/**
 * Convert pixels to inches at the given DPI
 */
export function pixelsToInches(pixels: number, dpi: number = PRINT_DPI): number {
  return pixels / dpi;
}

/**
 * Convert inches to EMU (English Metric Units) for DOCX
 */
export function inchesToEMU(inches: number): number {
  return Math.round(inches * INCH_TO_EMU);
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Calculate the aspect ratio from width and height in inches
 */
export function calculateAspectRatio(widthInches: number, heightInches: number): number {
  if (heightInches === 0) return 1;
  return widthInches / heightInches;
}

/**
 * Calculate print dimensions in pixels at 300 DPI
 */
export function getPrintDimensions(widthInches: number, heightInches: number): {
  widthPx: number;
  heightPx: number;
} {
  return {
    widthPx: inchesToPixels(widthInches),
    heightPx: inchesToPixels(heightInches),
  };
}

/**
 * Calculate the maximum dimensions that fit within a bounding box
 * while maintaining aspect ratio
 */
export function fitInBounds(
  contentWidth: number,
  contentHeight: number,
  boundsWidth: number,
  boundsHeight: number
): { width: number; height: number; scale: number } {
  const scaleW = boundsWidth / contentWidth;
  const scaleH = boundsHeight / contentHeight;
  const scale = Math.min(scaleW, scaleH);
  return {
    width: contentWidth * scale,
    height: contentHeight * scale,
    scale,
  };
}
