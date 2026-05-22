import type { Area } from 'react-easy-crop';
import { PRINT_DPI } from './constants';

/**
 * Create a cropped image from the source using Canvas API
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0,
  flipH: boolean = false,
  flipV: boolean = false
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = getRotatedSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate to center, rotate, then draw the image
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);

  // Apply flip
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // Draw the image centered
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Extract the cropped area from the rotated canvas
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Could not get cropped canvas context');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return croppedCanvas.toDataURL('image/png');
}

/**
 * Load an image from a source URL and return an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = src;
  });
}

/**
 * Calculate the size of a rotated rectangle's bounding box
 */
function getRotatedSize(width: number, height: number, rotation: number): {
  width: number;
  height: number;
} {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Resize an image to specific dimensions at print DPI
 */
export async function resizeImage(
  imageSrc: string,
  targetWidthInches: number,
  targetHeightInches: number,
  dpi: number = PRINT_DPI
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = Math.round(targetWidthInches * dpi);
  canvas.height = Math.round(targetHeightInches * dpi);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
}

/**
 * Apply a background color to an image
 * Replaces transparent pixels with the specified color
 */
export async function applyBackgroundColor(
  imageSrc: string,
  backgroundColor: string
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;

  // Fill background first
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw image on top
  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL('image/png');
}

/**
 * Simple background removal using threshold-based approach
 * Works best with solid-color backgrounds (like white walls)
 */
export async function removeBackground(
  imageSrc: string,
  threshold: number = 30
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sample the corner pixels to detect background color
  const cornerSamples = [
    getPixelColor(data, 0, 0, canvas.width),
    getPixelColor(data, canvas.width - 1, 0, canvas.width),
    getPixelColor(data, 0, canvas.height - 1, canvas.width),
    getPixelColor(data, canvas.width - 1, canvas.height - 1, canvas.width),
  ];

  // Average background color
  const bgR = cornerSamples.reduce((sum, c) => sum + c.r, 0) / cornerSamples.length;
  const bgG = cornerSamples.reduce((sum, c) => sum + c.g, 0) / cornerSamples.length;
  const bgB = cornerSamples.reduce((sum, c) => sum + c.b, 0) / cornerSamples.length;

  // For each pixel, if it's close to the background color, make it transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const distance = Math.sqrt(
      (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
    );

    if (distance < threshold) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

function getPixelColor(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number
): { r: number; g: number; b: number } {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

/**
 * Convert a data URL to a Blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Convert a data URL to base64 (without the data: prefix)
 */
export function dataURLtoBase64(dataURL: string): string {
  return dataURL.split(',')[1];
}

/**
 * Flip an image horizontally or vertically
 */
export async function flipImage(
  imageSrc: string,
  flipH: boolean,
  flipV: boolean
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return canvas.toDataURL('image/png');
}

/**
 * Process the final ID picture: crop, resize, and apply background
 */
export async function processIdPicture(
  imageSrc: string,
  pixelCrop: Area,
  targetWidthInches: number,
  targetHeightInches: number,
  rotation: number = 0,
  flipH: boolean = false,
  flipV: boolean = false,
  backgroundColor: string | null = null,
  shouldRemoveBg: boolean = false,
  bgThreshold: number = 30
): Promise<string> {
  // Step 1: Crop the image
  let result = await getCroppedImage(imageSrc, pixelCrop, rotation, flipH, flipV);

  // Step 2: Remove background if requested
  if (shouldRemoveBg) {
    result = await removeBackground(result, bgThreshold);
  }

  // Step 3: Apply background color
  if (backgroundColor) {
    result = await applyBackgroundColor(result, backgroundColor);
  }

  // Step 4: Resize to print dimensions
  result = await resizeImage(result, targetWidthInches, targetHeightInches);

  return result;
}
