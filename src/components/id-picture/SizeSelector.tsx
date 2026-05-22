'use client';

import { useAppStore } from '@/store/useAppStore';
import { SIZE_PRESETS } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SizeSelector() {
  const {
    selectedSize,
    setSelectedSize,
    customWidth,
    customHeight,
    setCustomWidth,
    setCustomHeight,
  } = useAppStore();

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Ruler className="h-4 w-4 text-emerald-600" />
          Step 2: Select Size
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedSize(preset)}
              className={`
                p-2 rounded-lg border text-left transition-all duration-200
                ${
                  selectedSize.id === preset.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-muted/50'
                }
              `}
            >
              <p className="text-xs font-semibold leading-tight">{preset.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {preset.description}
              </p>
            </button>
          ))}
        </div>

        {selectedSize.id === 'custom' && (
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="custom-width" className="text-xs">
                  Width (in)
                </Label>
                <Input
                  id="custom-width"
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.1}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="custom-height" className="text-xs">
                  Height (in)
                </Label>
                <Input
                  id="custom-height"
                  type="number"
                  min={0.5}
                  max={10}
                  step={0.1}
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
