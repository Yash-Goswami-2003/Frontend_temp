import { useFormContext } from "react-hook-form";
import { getNested } from "../SDUI_utils";

function Checkbox({
  fieldName,
  label,
  helper,
  path,
  validations,
  ...props
}) {
  const displayLabel = label || fieldName;
  const checkboxId = fieldName || `checkbox-${Math.random().toString(36).slice(2, 11)}`;

  const { register, formState: { errors } } = useFormContext();
  const fieldError = getNested(errors, path)?.message;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          className={`
            mt-0.5 w-5 h-5 rounded border cursor-pointer
            transition-all duration-200 ease-out
            text-blue-600 bg-white
            hover:border-gray-400
            focus:ring-2 focus:ring-blue-100 focus:ring-offset-0
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${fieldError ? "border-red-500" : "border-gray-300"}
          `}
          {...register(path, validations)}
          {...props}
        />

        {displayLabel && (
          <label 
            htmlFor={checkboxId} 
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            {displayLabel}
          </label>
        )}
      </div>

      {fieldError && (
        <span className="text-xs text-red-500 font-medium ml-8">
          {fieldError}
        </span>
      )}

      {helper && !fieldError && (
        <span className="text-xs text-gray-500 ml-8">
          {helper}
        </span>
      )}
    </div>
  );
}

export default Checkbox;
