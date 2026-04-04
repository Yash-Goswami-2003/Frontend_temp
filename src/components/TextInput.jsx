// components/TextInput.jsx
import React from 'react';

const TextInput = ({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  id,
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full group">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors duration-200 group-focus-within:text-gray-900"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container with White Liquid Gloss Effect */}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-5 py-4 
            bg-white 
            border border-gray-200 
            rounded-3xl 
            text-gray-900 placeholder:text-gray-400
            focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
            focus:border-violet-500 focus:ring-violet-500/30
            transition-all duration-300 ease-out
            shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_2px_8px_rgba(255,255,255,0.9)]
            hover:border-gray-300
            ${error 
              ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' 
              : ''
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
              : ''
            }
            ${className}
          `}
        />

        {/* Liquid Gloss Highlight Layer */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white via-white to-transparent opacity-70" />
      </div>

      {/* Helper Text or Error Message */}
      {(error || helperText) && (
        <p
          className={`mt-2 text-xs font-medium transition-all duration-200 ${
            error ? 'text-rose-500' : 'text-gray-500'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default TextInput;