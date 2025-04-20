import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              <GradientText>Dynamic & Seamless</GradientText> 
              <br />Payment Solutions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The AI-powered payment gateway that streamlines your transactions and supercharges your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20">
                  Get Started
                </Button>
              </Link>
              <Link href="/checkout">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-accent text-white hover:opacity-90 shadow-lg hover:shadow-secondary/20">
                  Try Checkout
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center text-gray-400">
              <div className="flex -space-x-2 mr-3">
                <Avatar className="border-2 border-gray-900 w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces" alt="User" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-gray-900 w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="User" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-gray-900 w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" alt="User" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
              </div>
              <span>Trusted by 10,000+ merchants worldwide</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              <motion.div 
                className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-primary/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1607968565043-36af90dde238?w=800&h=600&fit=crop" 
                  alt="FluxPay Dashboard" 
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end p-6">
                  <Glassmorphism className="rounded-xl p-4 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-semibold">Payment Analytics</div>
                      <div className="text-sm text-green-400">+24.5% MoM</div>
                    </div>
                    <div className="h-12 bg-gray-800/40 rounded-lg overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                    </div>
                  </Glassmorphism>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-10 -right-10 glassmorphism rounded-xl p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
                    <i className="fas fa-shield-alt text-white"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">AI Security</div>
                    <div className="text-xs text-gray-400">99.9% Fraud Protection</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 -left-10 glassmorphism rounded-xl p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <i className="fas fa-check text-white"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Instant Payouts</div>
                    <div className="text-xs text-gray-400">Real-time settlements</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
