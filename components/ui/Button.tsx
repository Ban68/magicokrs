
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, leftIcon, size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'border-transparent shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500',
    secondary: 'border-slate-300 shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:ring-brand-500',
    ghost: 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-brand-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
        {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
        {children}
        </>
      )}
    </button>
  );
};

export default Button;
