import { motion } from "framer-motion";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";
import { Button } from "@/components/ui/button";

export default function DashboardPreview() {
  const features = [
    {
      icon: "fas fa-chart-pie",
      title: "Real-time Analytics",
      description: "Monitor transaction volumes, success rates, and other key metrics in real-time to make informed decisions."
    },
    {
      icon: "fas fa-link",
      title: "Payment Link Creation",
      description: "Generate shareable payment links in seconds for quick invoice payments or product sales."
    },
    {
      icon: "fas fa-repeat",
      title: "Subscription Management",
      description: "Create and manage recurring payment plans with flexible billing cycles and automated retry logic."
    }
  ];

  return (
    <section className="py-20 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <GradientText>Powerful Merchant</GradientText> Dashboard
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take control of your payment operations with our intuitive and feature-rich merchant dashboard.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-12 h-12 rounded-xl bg-${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent'}-500/20 flex items-center justify-center mr-4 mt-1`}>
                    <i className={`${feature.icon} text-${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent'}-400`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="mt-8 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20"
            >
              Explore Dashboard <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              <motion.div 
                className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-primary/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
                  alt="FluxPay Dashboard" 
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end p-6">
                  <div className="w-full">
                    <Glassmorphism className="rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold">Transaction Overview</div>
                        <div className="text-sm text-gray-400">Last 30 days</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-2xl font-bold">$124,568.45</div>
                          <div className="text-green-400 text-sm">+18.2% vs last month</div>
                        </div>
                        <div className="flex items-end h-16 space-x-1">
                          {/* Simulating a bar chart */}
                          {[40, 60, 30, 70, 50, 80, 60, 90].map((height, index) => (
                            <div 
                              key={index} 
                              className={`w-2 ${index === 7 ? 'bg-primary' : 'bg-primary/30'} rounded-t`} 
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </Glassmorphism>
                    <div className="grid grid-cols-3 gap-4">
                      <Glassmorphism className="rounded-xl p-3">
                        <div className="text-xs text-gray-400">Success Rate</div>
                        <div className="text-lg font-semibold text-green-400">98.7%</div>
                      </Glassmorphism>
                      <Glassmorphism className="rounded-xl p-3">
                        <div className="text-xs text-gray-400">Transactions</div>
                        <div className="text-lg font-semibold">3,452</div>
                      </Glassmorphism>
                      <Glassmorphism className="rounded-xl p-3">
                        <div className="text-xs text-gray-400">Avg. Value</div>
                        <div className="text-lg font-semibold">$36.08</div>
                      </Glassmorphism>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating notification element */}
              <motion.div 
                className="absolute -top-5 -right-5 glassmorphism rounded-xl p-3 shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                  <div>
                    <div className="text-xs">Payment Received</div>
                    <div className="text-sm font-medium">$1,250.00 from Client X</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating API key element */}
              <motion.div 
                className="absolute bottom-5 -left-5 glassmorphism rounded-xl p-3 shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
                    <i className="fas fa-key text-white text-xs"></i>
                  </div>
                  <div>
                    <div className="text-xs">API Key</div>
                    <div className="text-sm font-medium font-mono">px_live_*******</div>
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
