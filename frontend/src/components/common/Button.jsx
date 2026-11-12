import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D6AD60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-md gap-2',
    lg: 'text-base px-6 py-3 rounded-lg gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] shadow-sm active:translate-y-0.5',
    gold: 'bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] font-semibold shadow-sm active:translate-y-0.5',
    secondary: 'bg-white text-[#101C2C] border border-[#E5E0D6] hover:bg-[#F5F1E8] shadow-sm',
    outline: 'border border-[#101C2C] text-[#101C2C] hover:bg-[#101C2C] hover:text-[#F5F1E8]',
    ghost: 'text-[#101C2C] hover:bg-black/5',
    danger: 'bg-[#C75A5A] text-white hover:bg-[#b04b4b]',
  };

  const classes = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
