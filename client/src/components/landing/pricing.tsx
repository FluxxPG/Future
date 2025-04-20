import { motion } from "framer-motion";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      price: "2.9% + $0.30",
      period: "Per transaction",
      isPopular: false,
      features: [
        { text: "Standard payment processing", included: true },
        { text: "Basic fraud protection", included: true },
        { text: "24/7 email support", included: true },
        { text: "5 integrations", included: true },
        { text: "Advanced AI features", included: false },
        { text: "Custom reporting", included: false },
      ],
      ctaText: "Get Started",
      ctaStyle: "border-primary-500 text-primary-400 hover:bg-primary-500/10"
    },
    {
      name: "Business",
      description: "Ideal for growing businesses",
      price: "2.5% + $0.25",
      period: "Per transaction",
      isPopular: true,
      features: [
        { text: "Advanced payment processing", included: true },
        { text: "AI fraud protection", included: true },
        { text: "24/7 priority support", included: true },
        { text: "50 integrations", included: true },
        { text: "Basic AI analytics", included: true },
        { text: "Custom API access", included: false },
      ],
      ctaText: "Get Started",
      ctaStyle: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg hover:shadow-primary/20"
    },
    {
      name: "Enterprise",
      description: "For large-scale operations",
      price: "Custom",
      period: "Volume-based pricing",
      isPopular: false,
      features: [
        { text: "Customized payment solutions", included: true },
        { text: "Enterprise-grade AI security", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Unlimited integrations", included: true },
        { text: "Advanced AI analytics", included: true },
        { text: "Custom API and webhooks", included: true },
      ],
      ctaText: "Contact Sales",
      ctaStyle: "border-accent-500 text-accent-400 hover:bg-accent-500/10"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>Transparent</GradientText> Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the right plan for your business needs with our simple and transparent pricing structure.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="glassmorphism-dark rounded-2xl p-8 lg:w-1/3 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-400">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <p className="text-gray-400">{plan.period}</p>
              </div>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                    ) : (
                      <i className="fas fa-times text-gray-500 mt-1 mr-3"></i>
                    )}
                    <span className={feature.included ? "" : "text-gray-500"}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="outline" 
                className={`w-full py-3 px-6 ${plan.ctaStyle}`}
              >
                {plan.ctaText}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">All plans include secure data storage, PCI compliance, and 99.99% uptime guarantee.</p>
          <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">View full pricing details →</a>
        </div>
      </div>
    </section>
  );
}
