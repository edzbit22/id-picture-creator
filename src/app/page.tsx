'use client';

import { useAppStore } from '@/store/useAppStore';
import { ImageUploader } from '@/components/id-picture/ImageUploader';
import { SizeSelector } from '@/components/id-picture/SizeSelector';
import { ImageEditor } from '@/components/id-picture/ImageEditor';
import { EditorToolbar } from '@/components/id-picture/EditorToolbar';
import { LayoutPreview } from '@/components/id-picture/LayoutPreview';
import { ExportPanel } from '@/components/id-picture/ExportPanel';
import { BackgroundOptions } from '@/components/id-picture/BackgroundOptions';
import { QuantitySelector } from '@/components/id-picture/QuantitySelector';
import { ThemeToggle } from '@/components/id-picture/ThemeToggle';
import { Camera, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const { processedImage, sourceImage, selectedSize, customWidth, customHeight } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pictureWidthInches = selectedSize.id === 'custom' ? customWidth : selectedSize.width;
  const pictureHeightInches = selectedSize.id === 'custom' ? customHeight : selectedSize.height;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight leading-tight">
                  ID Picture Creator
                </h1>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Create &amp; print professional ID photos
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {sourceImage && (
              <div className="hidden md:flex items-center gap-1.5 mr-3 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                <span className="font-medium text-emerald-600">{pictureWidthInches}&quot;</span>
                <span>×</span>
                <span className="font-medium text-emerald-600">{pictureHeightInches}&quot;</span>
                <Separator orientation="vertical" className="h-3 mx-1" />
                <span>300 DPI</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            shrink-0 border-r bg-background transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'w-80' : 'w-0 overflow-hidden border-0'}
            max-md:fixed max-md:top-[49px] max-md:bottom-0 max-md:left-0 max-md:z-40 max-md:w-80 max-md:border-r
          `}
        >
          <ScrollArea className="h-[calc(100vh-49px)]">
            <div className="p-3 space-y-3">
              <ImageUploader />
              <SizeSelector />
              {sourceImage && (
                <>
                  <EditorToolbar />
                  <BackgroundOptions />
                </>
              )}
              <QuantitySelector />
              <ExportPanel />
            </div>
          </ScrollArea>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* ID Picture Preview Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-600/10 flex items-center justify-center">
                  <Camera className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <h2 className="font-semibold text-sm">ID Picture Editor</h2>
              </div>

              {sourceImage ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Editor Cropper */}
                  <ImageEditor />

                  {/* Single Picture Preview */}
                  {processedImage && (
                    <div className="w-full max-w-md">
                      <div className="bg-muted/30 rounded-xl p-4 border">
                        <p className="text-xs text-muted-foreground mb-3 text-center font-medium">
                          Final ID Picture ({pictureWidthInches}&quot; × {pictureHeightInches}&quot; at 300 DPI)
                        </p>
                        <div className="flex items-center justify-center">
                          <div
                            className="bg-white border-2 border-emerald-200 shadow-lg overflow-hidden"
                            style={{
                              width: Math.min(pictureWidthInches * 96, 280),
                              height: Math.min(pictureHeightInches * 96, 280),
                            }}
                          >
                            <img
                              src={processedImage}
                              alt="ID Picture Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 text-center">
                          Print dimensions: {pictureWidthInches * 300} × {pictureHeightInches * 300} px
                        </p>
                      </div>
                    </div>
                  )}

                  {!processedImage && (
                    <div className="bg-muted/30 rounded-xl p-8 text-center w-full max-w-md border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        Click &quot;Generate Preview&quot; in the sidebar to create your ID picture
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted/20 rounded-xl p-16 text-center border border-dashed">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-emerald-600/40" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground mb-1">No Image Uploaded</h3>
                  <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
                    Upload a photo from the sidebar to get started with your ID picture
                  </p>
                </div>
              )}
            </section>

            {/* Paper Layout Preview */}
            {sourceImage && (
              <section className="space-y-3">
                <LayoutPreview />
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
