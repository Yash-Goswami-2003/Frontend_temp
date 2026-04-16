import React from 'react';

function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm border';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
