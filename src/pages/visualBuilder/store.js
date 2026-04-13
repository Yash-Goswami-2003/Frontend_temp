import { create } from 'zustand';

const defaultComponentConfigs = {
  TextInput: {
    c_name: 'TextInput',
    field_name: '',
    label: 'Text Input',
    path: '',
    placeholder: '',
    type: 'text',
    validations: {}
  },
  Select: {
    c_name: 'Select',
    field_name: '',
    label: 'Select',
    path: '',
    options: [
      { value: '', label: 'Select option...' },
      { value: '1', label: 'Option 1' }
    ],
    validations: {}
  },
  Checkbox: {
    c_name: 'Checkbox',
    field_name: '',
    label: 'Checkbox',
    path: '',
    validations: {}
  },
  Radio: {
    c_name: 'Radio',
    field_name: '',
    label: 'Radio Group',
    path: '',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ],
    validations: {}
  },
  NumberInput: {
    c_name: 'NumberInput',
    field_name: '',
    label: 'Number',
    path: '',
    min: 0,
    max: 100,
    validations: {}
  },
  DatePicker: {
    c_name: 'DatePicker',
    field_name: '',
    label: 'Date',
    path: '',
    validations: {}
  },
  LayoutRenderer: {
    c_name: 'LayoutRenderer',
    field_name: '',
    type: 'grid',
    Column: [1, 1],
    Row: [1],
    fields: []
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Deep clone helper
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Find and update nested item by ID
const updateInTree = (items, id, updates) => {
  return items.map(item => {
    if (item._id === id) {
      return { ...item, ...updates };
    }
    if (item.fields && item.fields.length > 0) {
      return {
        ...item,
        fields: updateInTree(item.fields, id, updates)
      };
    }
    return item;
  });
};

// Remove from tree
const removeFromTree = (items, id, path) => {
  if (path.length === 0) {
    return items.filter(item => item._id !== id);
  }
  return items.map((item, idx) => {
    if (idx !== path[0]) return item;
    return {
      ...item,
      fields: removeFromTree(item.fields || [], id, path.slice(1))
    };
  });
};

// Add to nested layout
const addToNested = (items, targetId, newItem) => {
  return items.map(item => {
    if (item._id === targetId && item.c_name === 'LayoutRenderer') {
      return {
        ...item,
        fields: [...(item.fields || []), newItem]
      };
    }
    if (item.fields) {
      return {
        ...item,
        fields: addToNested(item.fields, targetId, newItem)
      };
    }
    return item;
  });
};

// Find component in tree
const findInTree = (items, id, path) => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item._id === id) {
      return item;
    }
    if (item.fields) {
      const found = findInTree(item.fields, id, [...path, i]);
      if (found) return found;
    }
  }
  return null;
};

// Move item in tree
const moveInTree = (items, dragIdx, hoverIdx, path) => {
  if (path.length === 0) {
    const newItems = [...items];
    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(hoverIdx, 0, removed);
    return newItems;
  }
  return items.map((item, idx) => {
    if (idx !== path[0]) return item;
    return {
      ...item,
      fields: moveInTree(item.fields || [], dragIdx, hoverIdx, path.slice(1))
    };
  });
};

export const useBuilderStore = create((set, get) => ({
  canvasItems: [],
  selectedId: null,
  selectedPath: [],
  draggedType: null,
  draggedItem: null,
  defaultConfigs: defaultComponentConfigs,

  setDraggedType: (type) => set({ draggedType: type }),
  setDraggedItem: (item) => set({ draggedItem: item }),

  addToCanvas: (type, targetId = null) => {
    const config = clone(defaultComponentConfigs[type]);
    config._id = generateId();
    config.field_name = `${type.toLowerCase()}_${generateId().slice(0, 4)}`;
    
    if (type === 'LayoutRenderer') {
      config.fieldName = `layout_${generateId().slice(0, 4)}`;
    } else {
      config.path = config.field_name;
      // Add default grid positioning when adding to a LayoutRenderer
      if (targetId) {
        config.grid = { cols: [0, 1], rows: [0, 1] };
      }
    }

    set((state) => {
      if (targetId) {
        return {
          canvasItems: addToNested(state.canvasItems, targetId, config)
        };
      }
      return {
        canvasItems: [...state.canvasItems, config]
      };
    });

    return config._id;
  },

  removeFromCanvas: (id, parentPath = []) => {
    set((state) => {
      const newItems = removeFromTree(state.canvasItems, id, parentPath);
      return {
        canvasItems: newItems,
        selectedId: state.selectedId === id ? null : state.selectedId,
        selectedPath: state.selectedId === id ? [] : state.selectedPath
      };
    });
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      canvasItems: updateInTree(state.canvasItems, id, updates)
    }));
  },

  selectComponent: (id, path = []) => {
    set({ selectedId: id, selectedPath: path });
  },

  moveItem: (dragIdx, hoverIdx, parentPath = []) => {
    set((state) => ({
      canvasItems: moveInTree(state.canvasItems, dragIdx, hoverIdx, parentPath)
    }));
  },

  getSelectedComponent: () => {
    const { selectedId, selectedPath, canvasItems } = get();
    if (!selectedId) return null;
    
    // Navigate to parent array using path excluding the last index (which is the item itself)
    let items = canvasItems;
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const idx = selectedPath[i];
      items = items[idx]?.fields || [];
    }
    
    // Find item by ID in the current array
    return items.find(i => i._id === selectedId) || null;
  },

  generateConfig: () => {
    const { canvasItems } = get();
    const clean = (items) => items.map(item => {
      const { _id, ...rest } = item;
      const cleaned = { ...rest };
      if (item.fields) {
        cleaned.fields = clean(item.fields);
      }
      return cleaned;
    });
    return clean(canvasItems);
  },

  loadConfig: (config) => {
    const addIds = (items) => items.map(item => ({
      ...item,
      _id: generateId(),
      fields: item.fields ? addIds(item.fields) : undefined
    }));
    set({ 
      canvasItems: addIds(config), 
      selectedId: null, 
      selectedPath: [] 
    });
  },

  clearCanvas: () => {
    set({ canvasItems: [], selectedId: null, selectedPath: [] });
  }
}));
