import { create } from 'zustand';
import type { Area } from 'react-easy-crop';
import type { SizePreset, PaperSizeKey } from '@/utils/constants';
import { SIZE_PRESETS, DEFAULT_QUANTITY } from '@/utils/constants';
import type { LayoutPosition } from '@/utils/paperLayout';

interface AppState {
  // Image state
  sourceImage: string | null;
  processedImage: string | null;
  croppedAreaPixels: Area | null;

  // Size state
  selectedSize: SizePreset;
  customWidth: number;
  customHeight: number;

  // Editor state
  zoom: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  crop: { x: number; y: number } | null;

  // Output state
  quantity: number;
  backgroundColor: string;
  removeBackground: boolean;
  bgThreshold: number;

  // Paper
  paperSize: PaperSizeKey;

  // Layout
  layoutPositions: LayoutPosition[];

  // Actions
  setSourceImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  setCroppedAreaPixels: (area: Area | null) => void;
  setSelectedSize: (size: SizePreset) => void;
  setCustomWidth: (width: number) => void;
  setCustomHeight: (height: number) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setFlipH: (flip: boolean) => void;
  setFlipV: (flip: boolean) => void;
  setCrop: (crop: { x: number; y: number } | null) => void;
  setQuantity: (quantity: number) => void;
  setBackgroundColor: (color: string) => void;
  setRemoveBackground: (remove: boolean) => void;
  setBgThreshold: (threshold: number) => void;
  setPaperSize: (size: PaperSizeKey) => void;
  setLayoutPositions: (positions: LayoutPosition[]) => void;
  resetEditor: () => void;
}

const defaultSize = SIZE_PRESETS[1]; // 2x2 inch

export const useAppStore = create<AppState>((set) => ({
  // Image state
  sourceImage: null,
  processedImage: null,
  croppedAreaPixels: null,

  // Size state
  selectedSize: defaultSize,
  customWidth: 2,
  customHeight: 2,

  // Editor state
  zoom: 1,
  rotation: 0,
  flipH: false,
  flipV: false,
  crop: null,

  // Output state
  quantity: DEFAULT_QUANTITY,
  backgroundColor: '#FFFFFF',
  removeBackground: false,
  bgThreshold: 30,

  // Paper
  paperSize: 'shortBond',

  // Layout
  layoutPositions: [],

  // Actions
  setSourceImage: (image) => set({ sourceImage: image, processedImage: null, croppedAreaPixels: null }),
  setProcessedImage: (image) => set({ processedImage: image }),
  setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),
  setSelectedSize: (size) => set({ selectedSize: size }),
  setCustomWidth: (width) => set({ customWidth: width }),
  setCustomHeight: (height) => set({ customHeight: height }),
  setZoom: (zoom) => set({ zoom }),
  setRotation: (rotation) => set({ rotation }),
  setFlipH: (flip) => set({ flipH: flip }),
  setFlipV: (flip) => set({ flipV: flip }),
  setCrop: (crop) => set({ crop }),
  setQuantity: (quantity) => set({ quantity }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setRemoveBackground: (remove) => set({ removeBackground: remove }),
  setBgThreshold: (threshold) => set({ bgThreshold: threshold }),
  setPaperSize: (size) => set({ paperSize: size }),
  setLayoutPositions: (positions) => set({ layoutPositions: positions }),
  resetEditor: () =>
    set({
      sourceImage: null,
      processedImage: null,
      croppedAreaPixels: null,
      zoom: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      crop: null,
      backgroundColor: '#FFFFFF',
      removeBackground: false,
      bgThreshold: 30,
    }),
}));
