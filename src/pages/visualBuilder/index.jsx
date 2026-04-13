import { useState } from 'react';
import ComponentPalette from './ComponentPalette';
import Canvas from './Canvas';
import PropertyPanel from './PropertyPanel';
import PreviewPanel from './PreviewPanel';
import ConfigExporter from './ConfigExporter';
import { useBuilderStore } from './store';

function VisualBuilder() {
  const [showExporter, setShowExporter] = useState(false);
  const { canvasItems, clearCanvas } = useBuilderStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            VB
          </div>
          <h1 className="font-semibold text-gray-800">Visual Builder</h1>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">{canvasItems.length} items</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExporter(true)}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Import / Export
          </button>
          
          <button
            onClick={() => {
              if (canvasItems.length > 0 && confirm('Clear all items?')) {
                clearCanvas();
              }
            }}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Main Content - Order: Palette | Tree | Preview | Properties */}
      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette />
        <Canvas />
        <PreviewPanel />
        <PropertyPanel />
      </div>

      {/* Footer */}
      <footer className="h-8 bg-white border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Drag components to canvas</span>
          <span>•</span>
          <span>Click to select</span>
          <span>•</span>
          <span>Drop on Grid Layouts to nest</span>
        </div>
        <div>
          Server-Driven UI Builder
        </div>
      </footer>

      {/* Modals */}
      {showExporter && (
        <ConfigExporter onClose={() => setShowExporter(false)} />
      )}
    </div>
  );
}

export default VisualBuilder;
