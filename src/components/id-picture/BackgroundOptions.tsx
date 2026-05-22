'use client';

import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Palette, Eraser } from 'lucide-react';
import { BG_COLOR_PRESETS } from '@/utils/constants';

export function BackgroundOptions() {
  const {
    backgroundColor,
    setBackgroundColor,
    removeBackground,
    setRemoveBackground,
    bgThreshold,
    setBgThreshold,
  } = useAppStore();

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4 text-emerald-600" />
          Background Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Background Color Picker */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Background Color</span>
          <div className="grid grid-cols-3 gap-1.5">
            {BG_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setBackgroundColor(preset.color)}
                className={`
                  flex items-center gap-1.5 p-1.5 rounded-md border text-xs transition-all
                  ${
                    backgroundColor === preset.color
                      ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                      : 'border-border hover:border-emerald-300'
                  }
                `}
              >
                <div
                  className="h-4 w-4 rounded-sm border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="truncate">{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Custom color input */}
          <div className="flex items-center gap-2">
            <Label className="text-xs shrink-0">Custom:</Label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-7 w-7 rounded border border-border cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">{backgroundColor}</span>
          </div>
        </div>

        {/* Background Removal Toggle */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="remove-bg"
              checked={removeBackground}
              onCheckedChange={setRemoveBackground}
            />
            <Label htmlFor="remove-bg" className="text-xs flex items-center gap-1.5 cursor-pointer">
              <Eraser className="h-3.5 w-3.5" />
              Auto-remove background
            </Label>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Basic chroma-key removal. Works best with solid-color backgrounds.
          </p>

          {removeBackground && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sensitivity</span>
                <span className="text-xs font-mono text-muted-foreground">{bgThreshold}</span>
              </div>
              <Slider
                value={[bgThreshold]}
                min={10}
                max={100}
                step={5}
                onValueChange={([value]) => setBgThreshold(value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
