import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CreditCard,
  Key,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Menu,
  RefreshCcw,
  Shield,
  X,
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

export default function Sidebar({ currentTab, setCurrentTab }) {
  const [location, setLocation] = useLocation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    // Clear user from local storage
    localStorage.removeItem("fluxpay_user");
    // Redirect to home page
    setLocation("/");
  };
  
  const navigationItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: <BarChart3 className="h-5 w-5" />
    },
    { 
      id: "payment-links", 
      label: "Payment Links", 
      icon: <LinkIcon className="h-5 w-5" />
    },
    { 
      id: "subscriptions", 
      label: "Subscriptions", 
      icon: <RefreshCcw className="h-5 w-5" />
    },
    { 
      id: "api-keys", 
      label: "API Keys", 
      icon: <Key className="h-5 w-5" />
    },
    { 
      id: "kyc", 
      label: "KYC", 
      icon: <Shield className="h-5 w-5" />
    }
  ];
  
  const handleNavigation = (tabId) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };
  
  const sidebarContent = (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground py-6">
      <div className="flex items-center justify-center mb-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-3">
          <i className="fas fa-bolt text-white"></i>
        </div>
        <span className="text-2xl font-bold gradient-text">FluxPay</span>
      </div>
      
      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold text-sidebar-foreground/60">
          DASHBOARD
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                currentTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto px-6">
        <div className="flex items-center p-4 mb-4 bg-sidebar-accent/30 rounded-xl">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces" />
            <AvatarFallback>TD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Taylor Doe</p>
            <p className="text-xs text-sidebar-foreground/60">
              Premium Plan
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
  
  // Mobile sidebar with Sheet component
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-20 bg-background border-b border-border flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-2">
              <i className="fas fa-bolt text-white text-xs"></i>
            </div>
            <span className="text-xl font-bold gradient-text">FluxPay</span>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Space to ensure content doesn't hide under the header */}
        <div className="h-16"></div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <aside className="w-64 shrink-0 border-r border-border h-screen">
      {sidebarContent}
    </aside>
  );
}
