'use client';

import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
} from 'lucide-react';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/utils/constants';

export function EditorToolbar() {
  const { zoom, rotation, flipH, flipV, setZoom, setRotation, setFlipH, setFlipV } =
    useAppStore();

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Maximize className="h-4 w-4 text-emerald-600" />
          Editor Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Zoom Control */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Zoom</span>
            <span className="text-xs font-mono text-muted-foreground">
              {zoom.toFixed(1)}x
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setZoom(Math.max(ZOOM_MIN, zoom - ZOOM_STEP))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Slider
              value={[zoom]}
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={ZOOM_STEP}
              onValueChange={([value]) => setZoom(value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Rotation Control */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Rotation</span>
            <span className="text-xs font-mono text-muted-foreground">{rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setRotation(rotation - 90)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Rotate -90°</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Slider
              value={[rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={([value]) => setRotation(value)}
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setRotation(rotation + 90)}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Rotate +90°</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Flip Controls */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Flip</span>
          <div className="flex gap-2">
            <Button
              variant={flipH ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 h-7 text-xs ${flipH ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              onClick={() => setFlipH(!flipH)}
            >
              <FlipHorizontal className="h-3.5 w-3.5 mr-1" />
              Horizontal
            </Button>
            <Button
              variant={flipV ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 h-7 text-xs ${flipV ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              onClick={() => setFlipV(!flipV)}
            >
              <FlipVertical className="h-3.5 w-3.5 mr-1" />
              Vertical
            </Button>
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            setZoom(1);
            setRotation(0);
            setFlipH(false);
            setFlipV(false);
          }}
        >
          Reset All Controls
        </Button>
      </CardContent>
    </Card>
  );
}
