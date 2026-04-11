import { useFormContext } from "react-hook-form";

function DatePicker({
  fieldName,
  label,
  helper,
  path,
  min,
  max,
  validations,
  ...props
}) {
  const displayLabel = label || fieldName;
  const inputId = fieldName || `date-${Math.random().toString(36).slice(2, 11)}`;

  const { register, formState: { errors } } = useFormContext();
  const fieldError = errors?.[path]?.message;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {displayLabel && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-700"
        >
          {displayLabel}
        </label>
      )}

      <input
        id={inputId}
        type="date"
        min={min}
        max={max}
        className={`
          px-4 py-2.5 text-sm text-gray-900 bg-white border rounded-lg
          transition-all duration-200 ease-out outline-none w-full
          placeholder:text-gray-400
          hover:border-gray-300
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${fieldError ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
        `}
        {...register(path, validations)}
        {...props}
      />

      {fieldError && (
        <span className="text-xs text-red-500 font-medium">
          {fieldError}
        </span>
      )}

      {helper && !fieldError && (
        <span className="text-xs text-gray-500">
          {helper}
        </span>
      )}
    </div>
  );
}

export default DatePicker;
