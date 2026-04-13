import { FormProvider, useForm } from 'react-hook-form';
import InputFieldsRenderer from '../../components/InputFieldsRenderer';
import { useBuilderStore } from './store';
import { useEffect, useMemo } from 'react';

function PreviewPanel() {
  const { canvasItems } = useBuilderStore();
  const form = useForm({ mode: 'onChange' });
  
  // Convert canvas items to clean config
  const generateCleanConfig = (items) => {
    return items.map(item => {
      const { _id, ...rest } = item;
      const cleaned = { ...rest };
      if (item.fields) {
        cleaned.fields = generateCleanConfig(item.fields);
      }
      return cleaned;
    });
  };
  
  const cleanConfig = generateCleanConfig(canvasItems);
  const hasItems = canvasItems.length > 0;
  
  // Reset form when config changes to avoid react-hook-form errors
  useEffect(() => {
    form.reset();
  }, [canvasItems, form]);
  
  // Generate a stable key based on config structure
  const formKey = useMemo(() => {
    return JSON.stringify(cleanConfig.map(c => c.c_name + c.field_name));
  }, [cleanConfig]);

  const handleSubmit = (data) => {
    console.log('Form Data:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">Preview</h2>
          <p className="text-xs text-gray-500">Live form rendering</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {!hasItems ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-base font-medium text-gray-500">Add components to see preview</p>
            <p className="text-sm mt-1 text-gray-400">Drag items from the left panel</p>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <FormProvider {...form}>
                <form key={formKey} onSubmit={form.handleSubmit(handleSubmit)}>
                  <InputFieldsRenderer configs={cleanConfig} />
                  <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                  >
                    Submit Form
                  </button>
                </form>
              </FormProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;
