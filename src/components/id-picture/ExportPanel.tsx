'use client';

import { useExport, type ExportFormat } from '@/hooks/useExport';
import { useImageEditor } from '@/hooks/useImageEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileImage, ImageIcon, Loader2 } from 'lucide-react';

export function ExportPanel() {
  const { isExporting, exportError, handleExport, canExport } = useExport();
  const { processAndGeneratePreview, croppedAreaPixels, sourceImage } = useImageEditor();

  const needsProcessing = sourceImage && croppedAreaPixels;

  const handleProcessAndExport = async (format: ExportFormat) => {
    if (needsProcessing && !canExport) {
      await processAndGeneratePreview();
    }
    handleExport(format);
  };

  return (
    <Card className="border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Download className="h-4 w-4 text-emerald-600" />
          Step 5: Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Process Button */}
        {needsProcessing && (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={processAndGeneratePreview}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4 mr-2" />
            )}
            Generate Preview
          </Button>
        )}

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col h-auto py-2 gap-1"
            onClick={() => handleProcessAndExport('docx')}
            disabled={!canExport || isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-blue-600" />
            )}
            <span className="text-[10px]">DOCX</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col h-auto py-2 gap-1"
            onClick={() => handleProcessAndExport('pdf')}
            disabled={!canExport || isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-red-600" />
            )}
            <span className="text-[10px]">PDF</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col h-auto py-2 gap-1"
            onClick={() => handleProcessAndExport('png')}
            disabled={!canExport || isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileImage className="h-4 w-4 text-emerald-600" />
            )}
            <span className="text-[10px]">PNG</span>
          </Button>
        </div>

        {exportError && (
          <p className="text-xs text-destructive">{exportError}</p>
        )}

        {!sourceImage && (
          <p className="text-xs text-muted-foreground text-center">
            Upload an image to start
          </p>
        )}
      </CardContent>
    </Card>
  );
}
