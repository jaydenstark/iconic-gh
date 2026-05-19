import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'breaking';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'primary',
  children,
  ...props
}) => {
  const classes = [
    styles.badge,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
