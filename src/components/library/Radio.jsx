import { useFormContext } from "react-hook-form";

function Radio({
  fieldName,
  label,
  helper,
  path,
  options = [],
  validations,
  ...props
}) {
  const groupLabel = label || fieldName;
  const groupId = fieldName || `radio-${Math.random().toString(36).slice(2, 11)}`;

  const { register, formState: { errors } } = useFormContext();
  const fieldError = errors?.[path]?.message;

  return (
    <div className="flex flex-col gap-2 w-full">
      {groupLabel && (
        <span className="text-sm font-medium text-gray-700">
          {groupLabel}
        </span>
      )}

      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <label 
              key={option.value}
              htmlFor={optionId}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                id={optionId}
                type="radio"
                value={option.value}
                className={`
                  w-4 h-4 border cursor-pointer
                  transition-all duration-200 ease-out
                  text-blue-600 bg-white
                  focus:ring-2 focus:ring-blue-100
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${fieldError ? "border-red-500" : "border-gray-300"}
                `}
                {...register(path, validations)}
                {...props}
              />
              <span className="text-sm text-gray-700 select-none">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

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

export default Radio;
