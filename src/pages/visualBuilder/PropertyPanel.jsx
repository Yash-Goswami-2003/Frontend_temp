import { useBuilderStore } from './store';

function PropertyPanel() {
  const { getSelectedComponent, selectedId, updateComponent } = useBuilderStore();
  const component = getSelectedComponent();
  
  if (!selectedId || !component) {
    return (
      <div className="w-56 bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="p-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 p-4 text-center">
          <p className="text-xs">Select a component to edit</p>
        </div>
      </div>
    );
  }
  
  const isLayout = component.c_name === 'LayoutRenderer';
  
  const handleChange = (field, value) => {
    updateComponent(selectedId, { [field]: value });
  };
  
  const handleValidationChange = (key, value, subfield = null) => {
    const validations = { ...(component.validations || {}) };
    if (subfield) {
      validations[key] = { ...(validations[key] || {}), [subfield]: value };
    } else {
      validations[key] = value ? { message: value } : undefined;
      if (!value) delete validations[key];
    }
    updateComponent(selectedId, { validations });
  };
  
  const handleOptionsChange = (options) => {
    updateComponent(selectedId, { options });
  };
  
  const addOption = () => {
    const options = [...(component.options || [])];
    options.push({ value: `opt${options.length}`, label: `Option ${options.length}` });
    handleOptionsChange(options);
  };
  
  const removeOption = (idx) => {
    const options = [...(component.options || [])];
    options.splice(idx, 1);
    handleOptionsChange(options);
  };
  
  const updateOption = (idx, field, value) => {
    const options = [...(component.options || [])];
    options[idx] = { ...options[idx], [field]: value };
    handleOptionsChange(options);
  };

  const handleGridChange = (field, index, value) => {
    const arr = [...(component[field] || [])];
    arr[index] = parseInt(value) || 1;
    updateComponent(selectedId, { [field]: arr });
  };

  return (
    <div className="w-56 bg-white border-l border-gray-200 flex flex-col shrink-0">
      <div className="p-2 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Properties</h2>
        <p className="text-[10px] text-gray-500">{component.c_name}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Basic Properties */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Basic</h3>
          
          <div>
            <label className="block text-[10px] text-gray-600 mb-0.5">Field Name</label>
            <input
              type="text"
              value={component.field_name || ''}
              onChange={(e) => handleChange('field_name', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {!isLayout && (
            <>
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Label</label>
                <input
                  type="text"
                  value={component.label || ''}
                  onChange={(e) => handleChange('label', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Path</label>
                <input
                  type="text"
                  value={component.path || ''}
                  onChange={(e) => handleChange('path', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">e.g. personal.email</p>
              </div>
              
              {component.c_name === 'TextInput' && (
                <div>
                  <label className="block text-[10px] text-gray-600 mb-0.5">Placeholder</label>
                  <input
                    type="text"
                    value={component.placeholder || ''}
                    onChange={(e) => handleChange('placeholder', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Grid Positioning - for items inside LayoutRenderer */}
        {!isLayout && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Grid Position</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Col Start</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={component.grid?.cols?.[0] ?? 0}
                  onChange={(e) => {
                    const grid = { ...(component.grid || {}), cols: [parseInt(e.target.value) || 0, component.grid?.cols?.[1] ?? 1] };
                    handleChange('grid', grid);
                  }}
                  className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Col End</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={component.grid?.cols?.[1] ?? 1}
                  onChange={(e) => {
                    const grid = { ...(component.grid || {}), cols: [component.grid?.cols?.[0] ?? 0, parseInt(e.target.value) || 1] };
                    handleChange('grid', grid);
                  }}
                  className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Row Start</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={component.grid?.rows?.[0] ?? 0}
                  onChange={(e) => {
                    const grid = { ...(component.grid || {}), rows: [parseInt(e.target.value) || 0, component.grid?.rows?.[1] ?? 1] };
                    handleChange('grid', grid);
                  }}
                  className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Row End</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={component.grid?.rows?.[1] ?? 1}
                  onChange={(e) => {
                    const grid = { ...(component.grid || {}), rows: [component.grid?.rows?.[0] ?? 0, parseInt(e.target.value) || 1] };
                    handleChange('grid', grid);
                  }}
                  className="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400">0,1 = first column; 0,2 = first 2 cols</p>
          </div>
        )}
        
        {/* Grid Layout Properties */}
        {isLayout && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Grid</h3>
            
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Columns</label>
              <div className="flex gap-1 flex-wrap">
                {component.Column?.map((col, idx) => (
                  <input
                    key={idx}
                    type="number"
                    min="1"
                    max="12"
                    value={col}
                    onChange={(e) => handleGridChange('Column', idx, e.target.value)}
                    className="w-10 px-1 py-1 text-xs border border-gray-300 rounded"
                  />
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleGridChange('Column', (component.Column || []).length, '1')}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const arr = (component.Column || []).slice(0, -1);
                    updateComponent(selectedId, { Column: arr });
                  }}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-red-600"
                >
                  -
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] text-gray-600 mb-0.5">Rows</label>
              <div className="flex gap-1 flex-wrap">
                {component.Row?.map((row, idx) => (
                  <input
                    key={idx}
                    type="number"
                    min="1"
                    max="12"
                    value={row}
                    onChange={(e) => handleGridChange('Row', idx, e.target.value)}
                    className="w-10 px-1 py-1 text-xs border border-gray-300 rounded"
                  />
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleGridChange('Row', (component.Row || []).length, '1')}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const arr = (component.Row || []).slice(0, -1);
                    updateComponent(selectedId, { Row: arr });
                  }}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-red-600"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Options for Select/Radio */}
        {(component.c_name === 'Select' || component.c_name === 'Radio') && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Options</h3>
            {(component.options || []).map((opt, idx) => (
              <div key={idx} className="flex gap-1">
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => updateOption(idx, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-1 py-0.5 text-[10px] border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => updateOption(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-1 py-0.5 text-[10px] border border-gray-300 rounded"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="text-red-500 hover:text-red-700 px-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-1 text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
            >
              + Option
            </button>
          </div>
        )}
        
        {/* Validations */}
        {!isLayout && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Validations</h3>
            
            <div>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={!!component.validations?.required}
                  onChange={(e) => handleValidationChange('required', e.target.checked ? 'This field is required' : null)}
                  className="rounded border-gray-300 w-3 h-3"
                />
                <span className="text-xs text-gray-700">Required</span>
              </label>
              {component.validations?.required && (
                <input
                  type="text"
                  value={component.validations.required.message || ''}
                  onChange={(e) => handleValidationChange('required', e.target.value, 'message')}
                  placeholder="Error message"
                  className="mt-1 w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                />
              )}
            </div>
            
            {component.c_name === 'TextInput' && (
              <div>
                <label className="block text-[10px] text-gray-600 mb-0.5">Pattern (Regex)</label>
                <input
                  type="text"
                  value={component.validations?.pattern?.value || ''}
                  onChange={(e) => handleValidationChange('pattern', e.target.value, 'value')}
                  placeholder="^[^\s@]+@[^\s@]+$"
                  className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                />
                {component.validations?.pattern && (
                  <input
                    type="text"
                    value={component.validations.pattern.message || ''}
                    onChange={(e) => handleValidationChange('pattern', e.target.value, 'message')}
                    placeholder="Error message"
                    className="mt-0.5 w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                  />
                )}
              </div>
            )}
            
            {component.c_name === 'TextInput' && (
              <div className="flex gap-1">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-600 mb-0.5">Min Length</label>
                  <input
                    type="number"
                    value={component.validations?.minLength?.value || ''}
                    onChange={(e) => handleValidationChange('minLength', e.target.value, 'value')}
                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-600 mb-0.5">Max Length</label>
                  <input
                    type="number"
                    value={component.validations?.maxLength?.value || ''}
                    onChange={(e) => handleValidationChange('maxLength', e.target.value, 'value')}
                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
            
            {component.c_name === 'NumberInput' && (
              <div className="flex gap-1">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-600 mb-0.5">Min</label>
                  <input
                    type="number"
                    value={component.min || ''}
                    onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-600 mb-0.5">Max</label>
                  <input
                    type="number"
                    value={component.max || ''}
                    onChange={(e) => handleChange('max', parseInt(e.target.value) || 100)}
                    className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPanel;
