const availableComponents = [
  { type: 'TextInput', label: 'Text Input', icon: 'T', color: 'bg-blue-500' },
  { type: 'Select', label: 'Select Dropdown', icon: 'S', color: 'bg-green-500' },
  { type: 'Checkbox', label: 'Checkbox', icon: 'C', color: 'bg-purple-500' },
  { type: 'Radio', label: 'Radio Group', icon: 'R', color: 'bg-orange-500' },
  { type: 'NumberInput', label: 'Number Input', icon: 'N', color: 'bg-pink-500' },
  { type: 'DatePicker', label: 'Date Picker', icon: 'D', color: 'bg-cyan-500' },
  { type: 'LayoutRenderer', label: 'Grid Layout', icon: 'G', color: 'bg-gray-600' }
];

function ComponentPalette() {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-40 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-2 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Components</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {availableComponents.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 cursor-move transition-all group"
          >
            <div className={`w-6 h-6 rounded ${comp.color} flex items-center justify-center text-white text-xs font-bold`}>
              {comp.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 truncate">{comp.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComponentPalette;
