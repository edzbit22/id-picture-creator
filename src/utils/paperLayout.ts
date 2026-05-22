import { PICTURE_GAP, DEFAULT_MARGINS, PAPER_SIZES } from './constants';
import type { PaperSizeKey } from './constants';

export interface LayoutPosition {
  x: number; // in inches from left edge
  y: number; // in inches from top edge
  width: number; // in inches
  height: number; // in inches
  rowIndex: number;
  colIndex: number;
}

export interface PaperLayout {
  positions: LayoutPosition[];
  rows: number;
  cols: number;
  totalFit: number;
  paperWidth: number;
  paperHeight: number;
  availableWidth: number;
  availableHeight: number;
  usedWidth: number;
  usedHeight: number;
}

/**
 * Calculate how many ID pictures fit on a page and their positions
 */
export function calculatePaperLayout(
  pictureWidthInches: number,
  pictureHeightInches: number,
  quantity: number,
  paperSizeKey: PaperSizeKey = 'shortBond',
  gap: number = PICTURE_GAP,
  margins = DEFAULT_MARGINS
): PaperLayout {
  const paper = PAPER_SIZES[paperSizeKey];
  const paperWidth = paper.width;
  const paperHeight = paper.height;

  const availableWidth = paperWidth - margins.left - margins.right;
  const availableHeight = paperHeight - margins.top - margins.bottom;

  // Calculate how many pictures fit in each direction
  const cols = Math.max(1, Math.floor((availableWidth + gap) / (pictureWidthInches + gap)));
  const rows = Math.max(1, Math.floor((availableHeight + gap) / (pictureHeightInches + gap)));

  const totalFit = rows * cols;
  const actualQuantity = Math.min(quantity, totalFit);

  const positions: LayoutPosition[] = [];

  for (let i = 0; i < actualQuantity; i++) {
    const rowIndex = Math.floor(i / cols);
    const colIndex = i % cols;

    const x = margins.left + colIndex * (pictureWidthInches + gap);
    const y = margins.top + rowIndex * (pictureHeightInches + gap);

    positions.push({
      x,
      y,
      width: pictureWidthInches,
      height: pictureHeightInches,
      rowIndex,
      colIndex,
    });
  }

  // Calculate used area
  const usedWidth = cols * pictureWidthInches + (cols - 1) * gap;
  const usedHeight = rows * pictureHeightInches + (rows - 1) * gap;

  return {
    positions,
    rows,
    cols,
    totalFit,
    paperWidth,
    paperHeight,
    availableWidth,
    availableHeight,
    usedWidth,
    usedHeight,
  };
}
