import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeightRule,
  AlignmentType,
  VerticalAlign,
} from 'docx';
import { saveAs } from 'file-saver';
import { INCH_TO_EMU, DEFAULT_MARGINS, PICTURE_GAP, PAPER_SIZES } from '@/utils/constants';
import type { PaperSizeKey } from '@/utils/constants';
import { dataURLtoBase64 } from '@/utils/imageProcessing';
import type { LayoutPosition } from '@/utils/paperLayout';

/**
 * Unit conversions for the docx library:
 *
 * The docx library uses DIFFERENT units for different properties:
 * - PageSize, PageMargin, TableCell, TableRow → TWIPS (DXA): 1 inch = 1440 twips
 * - ImageRun transformation → EMU: 1 inch = 914400 EMU
 *
 * Mixing these up causes Word to crash or produce wrong sizes.
 */
const INCH_TO_TWIPS = 1440;

/**
 * Export ID pictures as a DOCX file with exact print dimensions.
 *
 * Uses a table-based layout so that each ID picture occupies a precise cell,
 * guaranteeing that the printed output matches the selected size exactly.
 */
export async function exportToDocx(
  imageDataURL: string,
  positions: LayoutPosition[],
  pictureWidthInches: number,
  pictureHeightInches: number,
  paperSizeKey: PaperSizeKey = 'shortBond'
): Promise<void> {
  const paper = PAPER_SIZES[paperSizeKey];
  const base64Data = dataURLtoBase64(imageDataURL);

  // Page dimensions in TWIPS (for PageSize)
  const pageWidth = Math.round(paper.width * INCH_TO_TWIPS);
  const pageHeight = Math.round(paper.height * INCH_TO_TWIPS);

  // Margins in TWIPS (for PageMargin)
  const marginTop = Math.round(DEFAULT_MARGINS.top * INCH_TO_TWIPS);
  const marginRight = Math.round(DEFAULT_MARGINS.right * INCH_TO_TWIPS);
  const marginBottom = Math.round(DEFAULT_MARGINS.bottom * INCH_TO_TWIPS);
  const marginLeft = Math.round(DEFAULT_MARGINS.left * INCH_TO_TWIPS);

  // Image dimensions in EMU (for ImageRun transformation)
  const imageWidthEMU = Math.round(pictureWidthInches * INCH_TO_EMU);
  const imageHeightEMU = Math.round(pictureHeightInches * INCH_TO_EMU);

  // Image dimensions in TWIPS (for TableCell and TableRow sizing)
  const imageWidthTwips = Math.round(pictureWidthInches * INCH_TO_TWIPS);
  const imageHeightTwips = Math.round(pictureHeightInches * INCH_TO_TWIPS);

  // Gap in TWIPS
  const gapTwips = Math.round(PICTURE_GAP * INCH_TO_TWIPS);

  // Group positions by row to determine grid structure
  const rowMap = new Map<number, LayoutPosition[]>();
  for (const pos of positions) {
    if (!rowMap.has(pos.rowIndex)) {
      rowMap.set(pos.rowIndex, []);
    }
    rowMap.get(pos.rowIndex)!.push(pos);
  }

  const sortedRows = Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  for (const [, rowPositions] of sortedRows) {
    rowPositions.sort((a, b) => a.colIndex - b.colIndex);
  }

  const numCols = sortedRows.length > 0 ? sortedRows[0][1].length : 0;

  // Build table rows
  const tableRows: TableRow[] = [];

  for (let rowIdx = 0; rowIdx < sortedRows.length; rowIdx++) {
    const [, rowPositions] = sortedRows[rowIdx];
    const cells: TableCell[] = [];

    for (let colIdx = 0; colIdx < rowPositions.length; colIdx++) {
      cells.push(
        new TableCell({
          width: {
            size: imageWidthTwips,  // TWIPS for cell width
            type: WidthType.DXA,
          },
          height: {
            value: imageHeightTwips,  // TWIPS for cell height
            rule: HeightRule.EXACT,
          },
          verticalAlign: VerticalAlign.CENTER,
          borders: {
            top: { style: 'none', size: 0, color: 'FFFFFF' },
            bottom: { style: 'none', size: 0, color: 'FFFFFF' },
            left: { style: 'none', size: 0, color: 'FFFFFF' },
            right: { style: 'none', size: 0, color: 'FFFFFF' },
          },
          margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 0, line: 240 },
              children: [
                new ImageRun({
                  data: base64Data,
                  transformation: {
                    width: imageWidthEMU,   // EMU for image display size
                    height: imageHeightEMU,  // EMU for image display size
                  },
                  type: 'png',
                }),
              ],
            }),
          ],
        })
      );
    }

    tableRows.push(
      new TableRow({
        height: {
          value: imageHeightTwips,  // TWIPS for row height
          rule: HeightRule.EXACT,
        },
        children: cells,
      })
    );
  }

  // Calculate total table width in TWIPS
  const totalTableWidth = numCols * imageWidthTwips;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageWidth,    // TWIPS for page size
              height: pageHeight,  // TWIPS for page size
            },
            margin: {
              top: marginTop,      // TWIPS for margins
              right: marginRight,
              bottom: marginBottom,
              left: marginLeft,
            },
          },
        },
        children: [
          new Table({
            width: {
              size: totalTableWidth,  // TWIPS for table width
              type: WidthType.DXA,
            },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'id-pictures.docx');
}
