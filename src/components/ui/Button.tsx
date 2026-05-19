import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  children,
  ...props
}, ref) => {
  const classes = [
    styles.button,
    styles[variant],
    size !== 'md' && styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
