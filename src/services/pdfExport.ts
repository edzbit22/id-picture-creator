import jsPDF from 'jspdf';
import { dataURLtoBlob } from '@/utils/imageProcessing';
import type { LayoutPosition } from '@/utils/paperLayout';
import { PAPER_SIZES } from '@/utils/constants';
import type { PaperSizeKey } from '@/utils/constants';

/**
 * Export ID pictures as a PDF file with exact print dimensions
 */
export async function exportToPdf(
  imageDataURL: string,
  positions: LayoutPosition[],
  paperSizeKey: PaperSizeKey = 'shortBond'
): Promise<void> {
  const paper = PAPER_SIZES[paperSizeKey];

  // jsPDF uses mm for dimensions
  const inchesToMm = (inches: number) => inches * 25.4;

  const pdf = new jsPDF({
    orientation: paper.width > paper.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [inchesToMm(paper.width), inchesToMm(paper.height)],
  });

  // Convert image data URL to a format jsPDF can use
  const imageBlob = dataURLtoBlob(imageDataURL);
  const imageUrl = URL.createObjectURL(imageBlob);

  // Wait for image to load
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imageUrl;
  });

  // Place each ID picture at its calculated position
  for (const pos of positions) {
    const xMm = inchesToMm(pos.x);
    const yMm = inchesToMm(pos.y);
    const widthMm = inchesToMm(pos.width);
    const heightMm = inchesToMm(pos.height);

    pdf.addImage(imageDataURL, 'PNG', xMm, yMm, widthMm, heightMm);
  }

  URL.revokeObjectURL(imageUrl);

  pdf.save('id-pictures.pdf');
}

/**
 * Export a single ID picture as PNG
 */
export async function exportToPng(
  imageDataURL: string
): Promise<void> {
  const blob = dataURLtoBlob(imageDataURL);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'id-picture.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
