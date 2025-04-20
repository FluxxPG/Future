import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Glassmorphism from "../ui/glassmorphism";
import { CalendarIcon } from "lucide-react";

export default function Cta() {
  const stats = [
    { value: "99.99%", label: "Uptime" },
    { value: "200+", label: "Integrations" },
    { value: "10,000+", label: "Merchants" },
    { value: "$2B+", label: "Processed" }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background blurs */}
      <motion.div 
        className="blur-bg bg-primary top-1/4 left-1/4"
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="blur-bg bg-secondary bottom-1/4 right-1/4"
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Glassmorphism 
            dark 
            className="rounded-3xl p-12 border border-gray-800 shadow-2xl shadow-primary/10"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="gradient-text">Transform Your Payments</span>?
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of businesses leveraging FluxPay's advanced payment infrastructure.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline" 
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              >
                <CalendarIcon className="mr-2 h-5 w-5" /> Schedule Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Glassmorphism>
        </motion.div>
      </div>
    </section>
  );
}
