import { useBuilderStore } from './store';
import { useState } from 'react';

function CanvasItem({ item, index, path = [], depth = 0 }) {
  const { selectedId, selectComponent, removeFromCanvas, canvasItems, moveItem } = useBuilderStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(null); // 'before', 'after', 'inside', or null
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
  
  // Tree reorder drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('dragItemPath', JSON.stringify(currentPath));
    e.dataTransfer.setData('dragItemId', item._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOverItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    // Determine drop position: before, after, or inside (for layouts)
    if (isLayout && y > height * 0.3 && y < height * 0.7) {
      setDragOver('inside');
    } else if (y < height / 2) {
      setDragOver('before');
    } else {
      setDragOver('after');
    }
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDropItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragPathStr = e.dataTransfer.getData('dragItemPath');
    const type = e.dataTransfer.getData('componentType');
    
    // Calculate drop position fresh (avoid stale state)
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    let dropPosition;
    if (isLayout && y > height * 0.3 && y < height * 0.7) {
      dropPosition = 'inside';
    } else if (y < height / 2) {
      dropPosition = 'before';
    } else {
      dropPosition = 'after';
    }
    
    setDragOver(null);
    
    // Handle new component drop (existing behavior for layouts)
    if (type && isLayout && dropPosition === 'inside') {
      const { addToCanvas } = useBuilderStore.getState();
      addToCanvas(type, item._id);
      return;
    }
    
    // Handle reorder
    if (dragPathStr) {
      const dragPath = JSON.parse(dragPathStr);
      const dragIdx = dragPath[dragPath.length - 1];
      const dragParentPath = dragPath.slice(0, -1);
      const hoverIdx = index;
      const hoverParentPath = path;
      
      // Only allow reorder within same parent
      if (JSON.stringify(dragParentPath) === JSON.stringify(hoverParentPath) && dragIdx !== hoverIdx) {
        let targetIdx = hoverIdx;
        // Adjust for removed item
        if (dragIdx < hoverIdx) {
          targetIdx = dropPosition === 'after' ? hoverIdx : hoverIdx - 1;
        } else {
          targetIdx = dropPosition === 'after' ? hoverIdx + 1 : hoverIdx;
        }
        moveItem(dragIdx, targetIdx, dragParentPath);
      }
    }
  };

  // Layout container handlers - for dropping into empty space or reordering
  const handleLayoutDragOver = (e) => {
    const type = e.dataTransfer.getData('componentType');
    const dragPathStr = e.dataTransfer.getData('dragItemPath');
    // Allow drop for new components OR for reordering items
    if (isLayout && (type || dragPathStr)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handleLayoutDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData('componentType');
    const dragPathStr = e.dataTransfer.getData('dragItemPath');
    
    // Handle new component drop
    if (type && isLayout) {
      const { addToCanvas } = useBuilderStore.getState();
      addToCanvas(type, item._id);
      return;
    }
    
    // Handle reorder - dropping into layout container
    if (dragPathStr && isLayout) {
      const dragPath = JSON.parse(dragPathStr);
      const dragIdx = dragPath[dragPath.length - 1];
      const dragParentPath = dragPath.slice(0, -1);
      const targetPath = currentPath; // Path to this layout
      
      // Only if coming from a different parent (moving into this layout)
      if (JSON.stringify(dragParentPath) !== JSON.stringify(targetPath)) {
        // For now, move to end of this layout
        const targetFields = item.fields || [];
        const targetIdx = targetFields.length;
        
        // This would need a moveBetweenParents action in store
        // For now, just remove from old and add to new at end
        // We'll use a simpler approach - just add support in store first
      }
    }
  };

  return (
    <div
      className={`
        relative border rounded transition-all cursor-pointer group text-left
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
        ${isLayout ? 'p-2' : 'p-1.5'}
        ${isDragging ? 'opacity-50' : ''}
        ${dragOver === 'before' ? 'border-t-2 border-t-blue-500' : ''}
        ${dragOver === 'after' ? 'border-b-2 border-b-blue-500' : ''}
        ${dragOver === 'inside' && isLayout ? 'ring-2 ring-blue-300 bg-blue-50/50' : ''}
      `}
      style={{ marginLeft: `${depth * 8}px` }}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOverItem}
      onDragLeave={handleDragLeave}
      onDrop={handleDropItem}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
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
        <div 
          className="space-y-1 mt-1 pt-1 border-t border-gray-200 border-dashed"
          onDragOver={handleLayoutDragOver}
          onDrop={handleLayoutDrop}
        >
          {item.fields.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-1">
              Drop here or drag to reorder
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
