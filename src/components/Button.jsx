// components/Button.jsx
import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'medium',     // 'small' | 'medium' | 'large'
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = `
    relative overflow-hidden
    font-medium tracking-wide
    rounded-3xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
    shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_2px_8px_rgba(255,255,255,0.9)]
    active:scale-[0.985]
  `;

  const variants = {
    primary: `
      bg-gradient-to-br from-violet-500 to-indigo-600 
      text-white 
      border border-violet-400/30
      hover:brightness-110 hover:shadow-lg
      focus:ring-violet-500/40
    `,
    secondary: `
      bg-white 
      text-gray-900 
      border border-gray-200
      hover:bg-gray-50 hover:border-gray-300
      focus:ring-gray-400/30
    `,
    outline: `
      bg-transparent 
      text-gray-700 
      border border-gray-300
      hover:bg-white hover:border-gray-400
      focus:ring-gray-400/30
    `
  };

  const sizes = {
    small: 'px-5 py-2.5 text-sm',
    medium: 'px-8 py-3.5 text-base',
    large: 'px-10 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-60 cursor-not-allowed shadow-none' : 'hover:-translate-y-0.5'}
        ${className}
      `}
      {...props}
    >
      {/* Liquid Gloss Highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-transparent rounded-3xl" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;