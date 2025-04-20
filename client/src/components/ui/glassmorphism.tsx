import React from 'react';
import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'none';
  blur?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  border?: boolean;
  hover?: boolean;
}

const Glassmorphism: React.FC<GlassmorphismProps> = ({
  children,
  className = '',
  variant = 'light',
  blur = 'md',
  border = true,
  hover = false,
}) => {
  let variantClasses = '';
  let blurClasses = '';
  let borderClasses = '';
  let hoverClasses = '';
  
  // Set variant classes
  if (variant === 'light') {
    variantClasses = 'bg-white/10 backdrop-blur';
  } else if (variant === 'dark') {
    variantClasses = 'bg-black/10 backdrop-blur';
  }
  
  // Set blur amount
  if (blur === 'sm') {
    blurClasses = 'backdrop-blur-sm';
  } else if (blur === 'md') {
    blurClasses = 'backdrop-blur-md';
  } else if (blur === 'lg') {
    blurClasses = 'backdrop-blur-lg';
  } else if (blur === 'xl') {
    blurClasses = 'backdrop-blur-xl';
  } else if (blur === 'none') {
    blurClasses = '';
  }
  
  // Set border
  if (border) {
    borderClasses = 'border border-white/20';
  }
  
  // Set hover effect
  if (hover) {
    hoverClasses = 'transition-all duration-300 hover:bg-white/20';
  }
  
  return (
    <div className={cn(
      variantClasses,
      blurClasses,
      borderClasses,
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
};

// Add CSS classes for common glassmorphism effects
const glassmorphismClasses = {
  light: 'bg-white/10 backdrop-blur-md border border-white/20',
  dark: 'bg-black/10 backdrop-blur-md border border-slate-800/30',
  card: 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6',
  'card-dark': 'bg-black/10 backdrop-blur-md border border-slate-800/30 rounded-xl p-6',
};

// Add these classes to your global CSS or to a style tag
const glassmorphismStyles = `
.glassmorphism {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

.glassmorphism-dark {
  @apply bg-black/10 backdrop-blur-md border border-slate-800/30;
}

.glassmorphism-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6;
}

.glassmorphism-card-dark {
  @apply bg-black/10 backdrop-blur-md border border-slate-800/30 rounded-xl p-6;
}
`;

export { glassmorphismClasses, glassmorphismStyles };
export default Glassmorphism;