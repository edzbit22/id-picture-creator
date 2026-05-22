// ID Picture Size Presets
export interface SizePreset {
  id: string;
  label: string;
  width: number; // in inches
  height: number; // in inches
  description: string;
}

export const SIZE_PRESETS: SizePreset[] = [
  { id: '1x1', label: '1x1 inch', width: 1, height: 1, description: 'Standard 1x1 ID' },
  { id: '2x2', label: '2x2 inch', width: 2, height: 2, description: 'Standard 2x2 ID' },
  { id: 'passport', label: 'Passport (2x2)', width: 2, height: 2, description: 'US Passport photo' },
  { id: 'passport-ph', label: 'PH Passport (1.77x1.38)', width: 1.77, height: 1.38, description: 'Philippine Passport' },
  { id: '1x1_25', label: '1x1.25 inch', width: 1, height: 1.25, description: 'Common ID size' },
  { id: '1_5x1_5', label: '1.5x1.5 inch', width: 1.5, height: 1.5, description: 'Medium square ID' },
  { id: '1_5x2', label: '1.5x2 inch', width: 1.5, height: 2, description: 'Half-body ID' },
  { id: 'custom', label: 'Custom Size', width: 0, height: 0, description: 'Set your own size' },
];

// Paper size constants (in inches)
export const PAPER_SIZES = {
  letter: { width: 8.5, height: 11, label: 'Letter (8.5 x 11)' },
  a4: { width: 8.27, height: 11.69, label: 'A4 (8.27 x 11.69)' },
  shortBond: { width: 8.5, height: 11, label: 'Short Bond Paper (8.5 x 11)' },
  longBond: { width: 8.5, height: 13, label: 'Long Bond Paper (8.5 x 13)' },
} as const;

export type PaperSizeKey = keyof typeof PAPER_SIZES;

// Default paper margins (in inches)
export const DEFAULT_MARGINS = {
  top: 0.25,
  right: 0.25,
  bottom: 0.25,
  left: 0.25,
};

// Gap between pictures on paper (in inches)
export const PICTURE_GAP = 0.1;

// Print DPI
export const PRINT_DPI = 300;

// Background color presets
export const BG_COLOR_PRESETS = [
  { id: 'white', label: 'White', color: '#FFFFFF' },
  { id: 'blue', label: 'Blue', color: '#438EDB' },
  { id: 'red', label: 'Red', color: '#D32F2F' },
  { id: 'lightblue', label: 'Light Blue', color: '#B3D9FF' },
  { id: 'lightgray', label: 'Light Gray', color: '#E0E0E0' },
  { id: 'custom', label: 'Custom', color: '#000000' },
];

// Zoom limits
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1;

// Rotation step for quick rotate
export const ROTATION_STEP = 90;

// Default quantity
export const DEFAULT_QUANTITY = 8;

// EMU (English Metric Units) conversion
export const INCH_TO_EMU = 914400;
export const CM_TO_EMU = 360000;
