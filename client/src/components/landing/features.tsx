import { motion } from "framer-motion";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";

export default function Features() {
  const features = [
    {
      icon: "fas fa-shield-alt",
      title: "AI Fraud Detection",
      description: "Advanced machine learning algorithms that analyze transactions in real-time to detect and prevent fraudulent activities.",
      color: "from-primary-500 to-accent-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-primary-400 hover:text-primary-300"
    },
    {
      icon: "fas fa-bolt",
      title: "Instant Payouts",
      description: "Real-time settlement system that allows merchants to access their funds instantly after a successful transaction.",
      color: "from-secondary-500 to-primary-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-secondary-400 hover:text-secondary-300"
    },
    {
      icon: "fas fa-code",
      title: "Developer-Friendly API",
      description: "Comprehensive and well-documented APIs that make integration straightforward for developers of all skill levels.",
      color: "from-accent-500 to-secondary-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-accent-400 hover:text-accent-300"
    },
    {
      icon: "fas fa-chart-line",
      title: "Predictive Analytics",
      description: "Machine learning models that provide insights and forecasts to help merchants make data-driven business decisions.",
      color: "from-green-500 to-accent-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-green-400 hover:text-green-300"
    },
    {
      icon: "fas fa-globe",
      title: "Global Currency Support",
      description: "Support for 100+ currencies with competitive exchange rates and automatic currency conversion.",
      color: "from-blue-500 to-primary-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-blue-400 hover:text-blue-300"
    },
    {
      icon: "fas fa-id-card",
      title: "AI-Powered KYC",
      description: "Advanced OCR and facial recognition technology that streamlines the KYC/AML verification process.",
      color: "from-yellow-500 to-secondary-500",
      link: "#",
      linkText: "Learn more",
      linkColor: "text-yellow-400 hover:text-yellow-300"
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>Cutting-Edge</GradientText> Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of payment processing with our innovative solutions powered by advanced AI technologies.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glassmorphism-dark rounded-2xl p-6 transition-all hover:translate-y-[-5px] hover:shadow-lg hover:shadow-primary-600/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center mb-6`}>
                <i className={`${feature.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              <a href={feature.link} className={`inline-flex items-center mt-4 ${feature.linkColor} transition-colors`}>
                {feature.linkText} <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
