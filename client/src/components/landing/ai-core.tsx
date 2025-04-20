import { motion } from "framer-motion";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";
import { Button } from "@/components/ui/button";

export default function AiCore() {
  const aiServices = [
    {
      icon: "fas fa-shield-alt",
      title: "Fraud Detection",
      description: "AI-powered system that analyzes transaction patterns to detect and prevent fraudulent activities in real-time.",
      stats: {
        label: "Fraud Rate",
        value: "0.03%",
        change: "-24% MoM"
      },
      note: "Industry-leading accuracy"
    },
    {
      icon: "fas fa-route",
      title: "Smart Routing",
      description: "Intelligent payment routing system that optimizes for cost, speed, and success rate in real-time.",
      stats: {
        label: "Success Rate",
        value: "99.2%",
        change: "+2.1% YoY"
      },
      note: "Adaptive to market conditions"
    },
    {
      icon: "fas fa-id-card",
      title: "KYC/AML",
      description: "Advanced OCR and facial recognition technology for streamlined identity verification and compliance.",
      stats: {
        label: "Verification Time",
        value: "3.2 min",
        change: "-40% YoY"
      },
      note: "Compliant with global regulations"
    },
    {
      icon: "fas fa-chart-line",
      title: "Predictive Analytics",
      description: "Machine learning models that provide insights and forecasts to help merchants make data-driven decisions.",
      stats: {
        label: "Prediction Accuracy",
        value: "92.7%",
        change: "+5.3% QoQ"
      },
      note: "Continuously learning and improving"
    }
  ];

  return (
    <section className="py-20 bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>Powered by Advanced</GradientText> AI Technology
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our proprietary AI core drives every aspect of the FluxPay platform, providing unmatched security, efficiency, and insights.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="col-span-1 lg:col-span-2 row-span-2 glassmorphism-dark rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center mr-4">
                <i className="fas fa-brain text-white"></i>
              </div>
              <h3 className="text-2xl font-semibold">Neural Engine</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Our core neural network processes millions of transactions per second, learning and adapting to new patterns in real-time.
            </p>
            
            <div className="relative h-64 mb-6 glassmorphism rounded-xl overflow-hidden p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Neural network visualization */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 bg-${i % 2 === 0 ? 'secondary' : i % 3 === 0 ? 'accent' : 'primary'} rounded-full`}
                      style={{ 
                        top: `${(i * 20) % 100}%`, 
                        left: `${(i * 25) % 100}%` 
                      }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}
                  
                  {/* SVG for connecting lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-60">
                    <line x1="25%" y1="25%" x2="33%" y2="75%" stroke="url(#gradient1)" strokeWidth="1" />
                    <line x1="33%" y1="75%" x2="50%" y2="50%" stroke="url(#gradient2)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="67%" y2="25%" stroke="url(#gradient1)" strokeWidth="1" />
                    <line x1="67%" y1="25%" x2="75%" y2="75%" stroke="url(#gradient2)" strokeWidth="1" />
                    <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="url(#gradient3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="url(#gradient3)" strokeWidth="1" />
                    
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 glassmorphism-dark p-3">
                <div className="text-xs text-gray-400">Neural Network Status</div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Active</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Processing Power</span>
                    <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-primary to-secondary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Glassmorphism className="rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-semibold">99.8%</span>
                  <span className="text-green-400 text-xs">+0.3%</span>
                </div>
              </Glassmorphism>
              <Glassmorphism className="rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Processing</div>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-semibold">2.4ms</span>
                  <span className="text-green-400 text-xs">-0.5ms</span>
                </div>
              </Glassmorphism>
            </div>
          </motion.div>
          
          {aiServices.map((service, index) => (
            <motion.div 
              key={index}
              className="glassmorphism-dark rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-${index === 0 ? 'secondary' : index === 1 ? 'accent' : index === 2 ? 'green' : 'blue'}-500 to-${index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'accent' : 'primary'}-500 flex items-center justify-center mr-3`}>
                  <i className={`${service.icon} text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
              
              <p className="text-gray-400 mb-4">{service.description}</p>
              
              <Glassmorphism className="rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{service.stats.label}</span>
                  <span className="text-green-400 text-xs">{service.stats.change}</span>
                </div>
                <div className="text-xl font-semibold">{service.stats.value}</div>
              </Glassmorphism>
              
              <div className="text-xs text-gray-500 flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-1"></i>
                <span>{service.note}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20">
            <i className="fas fa-rocket mr-2"></i> Explore AI Technology
          </Button>
        </div>
      </div>
    </section>
  );
}
