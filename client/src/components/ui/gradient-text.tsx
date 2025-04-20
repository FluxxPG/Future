import React from 'react';
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'custom';
  from?: string;
  to?: string;
  via?: string;
  animated?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  variant = 'primary',
  from,
  to,
  via,
  animated = false,
}) => {
  let gradientClasses = '';
  
  if (variant === 'primary') {
    gradientClasses = 'from-primary to-secondary';
  } else if (variant === 'secondary') {
    gradientClasses = 'from-secondary to-accent';
  } else if (variant === 'accent') {
    gradientClasses = 'from-accent to-primary';
  } else if (variant === 'custom' && from && to) {
    gradientClasses = `from-${from} to-${to}`;
    if (via) {
      gradientClasses += ` via-${via}`;
    }
  }
  
  const animationClasses = animated ? 'bg-[length:400%_400%] animate-gradient' : '';
  
  return (
    <span className={cn(
      "text-transparent bg-clip-text bg-gradient-to-r",
      gradientClasses,
      animationClasses,
      className
    )}>
      {children}
    </span>
  );
};

export default GradientText;