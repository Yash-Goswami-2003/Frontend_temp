import { useState } from 'react';
import { useBuilderStore } from './store';

function ConfigExporter({ onClose }) {
  const { generateConfig, canvasItems, loadConfig, clearCanvas } = useBuilderStore();
  const [jsonText, setJsonText] = useState('');
  const [mode, setMode] = useState('export'); // 'export' | 'import'
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const config = generateConfig();
  const configString = JSON.stringify(config, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Config must be an array of components');
      }
      loadConfig(parsed);
      setError(null);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDownload = () => {
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            {mode === 'export' ? 'Export Configuration' : 'Import Configuration'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('export')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                mode === 'export' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setMode('import')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                mode === 'import' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Import
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {mode === 'export' ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                  {configString}
                </pre>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col p-4">
              <p className="text-sm text-gray-600 mb-2">
                Paste JSON configuration to load into the builder. This will replace the current canvas.
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[{"c_name": "TextInput", "field_name": "email", ...}]'
                className="flex-1 w-full p-3 text-xs font-mono border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleImport}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Import & Replace
                </button>
                <button
                  onClick={() => {
                    if (confirm('Clear all items?')) clearCanvas();
                  }}
                  className="py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium"
                >
                  Clear Canvas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfigExporter;
