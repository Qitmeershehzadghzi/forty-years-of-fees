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
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C4E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-2 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-5 py-3 rounded-lg gap-2',
  };

  const variantClasses = {
    primary: 'bg-[#0F5C4E] text-white hover:bg-[#0B443A]',
    gold: 'bg-[#0F5C4E] text-white hover:bg-[#0B443A]',
    secondary: 'bg-white text-[#12231F] border border-[#E2E7E2] hover:bg-[#F6F7F4]',
    outline: 'border border-[#0F5C4E] text-[#0F5C4E] hover:bg-[#EDF5F2]',
    ghost: 'text-[#0F5C4E] hover:bg-[#EDF5F2]',
    danger: 'bg-[#B42318] text-white hover:bg-[#912018]',
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
