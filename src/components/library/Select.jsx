import { useFormContext } from "react-hook-form";

function Select({
  fieldName,
  label,
  helper,
  path,
  options = [],
  validations,
  ...props
}) {
  const displayLabel = label || fieldName;
  const selectId = fieldName || `select-${Math.random().toString(36).slice(2, 11)}`;

  const { register, formState: { errors } } = useFormContext();
  const fieldError = errors?.[path]?.message;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {displayLabel && (
        <label 
          htmlFor={selectId} 
          className="text-sm font-medium text-gray-700"
        >
          {displayLabel}
        </label>
      )}

      <select
        id={selectId}
        className={`
          px-4 py-2.5 text-sm text-gray-900 bg-white border rounded-lg
          transition-all duration-200 ease-out outline-none w-full
          appearance-none cursor-pointer
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] 
          bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-10
          hover:border-gray-300
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${fieldError ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
        `}
        {...register(path, validations)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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

export default Select;
