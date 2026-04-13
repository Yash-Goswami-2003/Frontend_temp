import { useBuilderStore } from './store';

function CanvasItem({ item, index, path = [], depth = 0 }) {
  const { selectedId, selectComponent, removeFromCanvas, canvasItems } = useBuilderStore();
  const isSelected = selectedId === item._id;
  const isLayout = item.c_name === 'LayoutRenderer';
  const currentPath = [...path, index];
  
  const handleClick = (e) => {
    e.stopPropagation();
    selectComponent(item._id, currentPath);
  };
  
  const handleRemove = (e) => {
    e.stopPropagation();
    // Get parent path by removing the last element from currentPath
    const parentPath = currentPath.slice(0, -1);
    removeFromCanvas(item._id, parentPath);
  };
  
  const handleDragOver = (e) => {
    if (isLayout) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handleDrop = (e) => {
    if (isLayout) {
      e.preventDefault();
      e.stopPropagation();
      const type = e.dataTransfer.getData('componentType');
      if (type) {
        const { addToCanvas } = useBuilderStore.getState();
        addToCanvas(type, item._id);
      }
    }
  };

  return (
    <div
      className={`
        relative border rounded transition-all cursor-pointer group text-left
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
        ${isLayout ? 'p-2' : 'p-1.5'}
      `}
      style={{ marginLeft: `${depth * 8}px` }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`
            text-[10px] px-1 py-0.5 rounded font-medium shrink-0
            ${isLayout ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            {item.c_name === 'LayoutRenderer' ? 'GRID' : item.c_name.slice(0, 4).toUpperCase()}
          </span>
          <span className="text-xs font-medium text-gray-700 truncate">
            {item.label || item.field_name || 'Unnamed'}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Layout info */}
      {isLayout && (
        <div className="text-[10px] text-gray-400 mt-1">
          {item.Column?.length}×{item.Row?.length} grid
        </div>
      )}
      
      {/* Nested fields - compact */}
      {isLayout && item.fields && (
        <div className="space-y-1 mt-1 pt-1 border-t border-gray-200 border-dashed">
          {item.fields.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-1">
              Drop here
            </p>
          ) : (
            item.fields.map((child, childIndex) => (
              <CanvasItem
                key={child._id}
                item={child}
                index={childIndex}
                path={currentPath}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Canvas() {
  const { canvasItems, addToCanvas, selectComponent } = useBuilderStore();
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    if (type) {
      const id = addToCanvas(type);
      selectComponent(id);
    }
  };

  return (
    <div className="w-52 flex flex-col bg-gray-100 border-r border-gray-200 shrink-0">
      <div className="p-2 bg-white border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Tree</h2>
        <p className="text-[10px] text-gray-500">{canvasItems.length} items</p>
      </div>
      
      <div
        className="flex-1 overflow-y-auto p-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => selectComponent(null, [])}
      >
        {canvasItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <p className="text-xs">Drop components here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {canvasItems.map((item, index) => (
              <CanvasItem
                key={item._id}
                item={item}
                index={index}
                path={[]}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Canvas;
