import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Glassmorphism from "../ui/glassmorphism";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#integrations", label: "Integrations" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Glassmorphism dark className="py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-3">
                <i className="fas fa-bolt text-white"></i>
              </div>
              <span className="text-2xl font-bold gradient-text">FluxPay</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <div className="flex items-center">
              <Link href="/login">
                <a className="text-gray-300 hover:text-white mr-6 transition-colors">Log In</a>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </div>
            
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glassmorphism-dark">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-2">
                          <i className="fas fa-bolt text-white text-xs"></i>
                        </div>
                        <span className="text-xl font-bold gradient-text">FluxPay</span>
                      </div>
                      <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col space-y-4 mb-8">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors py-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            const element = document.querySelector(link.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    
                    <div className="flex flex-col space-y-4 mt-auto">
                      <Link href="/login">
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Glassmorphism>
    </motion.nav>
  );
}
