import { useEffect, useRef } from 'react';

interface ParticlesProps {
  count?: number;
  className?: string;
}

export function Particles({ count = 20, className = '' }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      
      // Random size between 2-6px
      const size = Math.random() * 4 + 2;
      
      // Apply styles
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = 'rgba(255, 255, 255, 0.1)';
      particle.style.borderRadius = '50%';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Animation
      const duration = Math.random() * 20 + 10;
      particle.style.animation = `float ${duration}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Opacity
      particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
      
      container.appendChild(particle);
    }
    
    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [count]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-[-1] overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

export default Particles;
