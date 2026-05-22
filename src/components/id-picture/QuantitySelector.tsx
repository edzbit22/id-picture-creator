'use client';

import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Hash, Minus, Plus } from 'lucide-react';
import { PAPER_SIZES } from '@/utils/constants';
import type { PaperSizeKey } from '@/utils/constants';
import { calculatePaperLayout } from '@/utils/paperLayout';
import { DEFAULT_MARGINS } from '@/utils/constants';
import { useEffect, useMemo } from 'react';

export function QuantitySelector() {
  const {
    quantity,
    setQuantity,
    paperSize,
    setPaperSize,
    selectedSize,
    customWidth,
    customHeight,
    setLayoutPositions,
  } = useAppStore();

  const pictureWidthInches = selectedSize.id === 'custom' ? customWidth : selectedSize.width;
  const pictureHeightInches = selectedSize.id === 'custom' ? customHeight : selectedSize.height;

  const layout = useMemo(
    () =>
      calculatePaperLayout(
        pictureWidthInches,
        pictureHeightInches,
        quantity,
        paperSize,
        undefined,
        DEFAULT_MARGINS
      ),
    [pictureWidthInches, pictureHeightInches, quantity, paperSize]
  );

  // Update layout positions when layout changes
  useEffect(() => {
    setLayoutPositions(layout.positions);
  }, [layout.positions, setLayoutPositions]);

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Hash className="h-4 w-4 text-emerald-600" />
          Step 4: Quantity & Layout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Paper Size */}
        <div className="space-y-1">
          <Label className="text-xs">Paper Size</Label>
          <Select
            value={paperSize}
            onValueChange={(value) => setPaperSize(value as PaperSizeKey)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAPER_SIZES).map(([key, paper]) => (
                <SelectItem key={key} value={key}>
                  {paper.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <Label className="text-xs">Number of Copies</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Input
              type="number"
              min={1}
              max={layout.totalFit}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 0) setQuantity(Math.min(val, layout.totalFit));
              }}
              className="h-8 text-sm text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setQuantity(Math.min(layout.totalFit, quantity + 1))}
              disabled={quantity >= layout.totalFit}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Layout Info */}
        <div className="bg-muted/50 rounded-lg p-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Layout:</span>
            <span className="font-medium">
              {layout.cols} × {layout.rows} = {layout.totalFit} max
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Printing:</span>
            <span className="font-medium">{quantity} copies</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Picture size:</span>
            <span className="font-medium">
              {pictureWidthInches}&quot; × {pictureHeightInches}&quot;
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
