import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/index";
import DashboardPage from "@/pages/dashboard";
import AdminPage from "@/pages/admin";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import CheckoutPage from "@/pages/checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/:tab" component={DashboardPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/:tab" component={AdminPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize particle animation with enhanced futuristic look
  useEffect(() => {
    const createParticles = () => {
      const container = document.createElement('div');
      container.classList.add('particles');
      container.id = 'particles';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '-1';
      container.style.overflow = 'hidden';
      
      document.body.appendChild(container);
      
      // Create more particles for a richer effect
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 1-5px
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position
        particle.style.position = 'absolute';
        
        // Use different colors for some particles
        const colorChoice = Math.random();
        if (colorChoice < 0.7) {
          // Most particles are white
          particle.style.background = 'rgba(255, 255, 255, 0.15)';
        } else if (colorChoice < 0.85) {
          // Some are primary color
          particle.style.background = 'rgba(124, 58, 237, 0.15)';  // Primary color
        } else {
          // Some are secondary color
          particle.style.background = 'rgba(236, 72, 153, 0.15)';  // Secondary color
        }
        
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animation with varied durations
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add subtle glow effect
        particle.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.1)';
        
        // Opacity
        particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
        
        container.appendChild(particle);
      }
    };
    
    // Only create particles on the landing page
    if (window.location.pathname === '/') {
      createParticles();
    }
    
    // Cleanup
    return () => {
      const particlesContainer = document.getElementById('particles');
      if (particlesContainer) {
        particlesContainer.remove();
      }
    };
  }, []);

  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
