import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";
import { Button } from "@/components/ui/button";

export default function Integrations() {
  // Fetch integrations from the API
  const { data: integrations = [] } = useQuery({
    queryKey: ["/api/integrations"],
    initialData: []
  });

  // If no integrations were fetched, use these sample ones
  const displayIntegrations = integrations.length > 0 ? integrations : [
    {
      id: 1,
      name: "Shopify",
      description: "Integrate payments directly with your Shopify store.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg",
      isActive: true
    },
    {
      id: 2,
      name: "Salesforce",
      description: "Sync payment data with your CRM automatically.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg",
      isActive: false
    },
    {
      id: 3,
      name: "Slack",
      description: "Get real-time payment notifications in your channels.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
      isActive: true
    },
    {
      id: 4,
      name: "WooCommerce",
      description: "Process payments on your WordPress store.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
      isActive: false
    },
    {
      id: 5,
      name: "Google Analytics",
      description: "Track payment conversions and customer behavior.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
      isActive: true
    },
    {
      id: 6,
      name: "Apple Pay",
      description: "Enable one-tap checkout for Apple device users.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
      isActive: true
    },
    {
      id: 7,
      name: "AWS",
      description: "Securely store payment data in S3 and more.",
      logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
      isActive: false
    }
  ];

  // Add the "More Integrations" card
  const allIntegrations = [
    ...displayIntegrations,
    {
      id: 'more',
      name: "More Integrations",
      description: "Explore our marketplace of 200+ integrations.",
      logoUrl: "",
      isActive: null
    }
  ];

  return (
    <section id="integrations" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>200+ Integrations</GradientText> Powered by AI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect FluxPay with your favorite tools through our AI-powered integration engine.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              className="glassmorphism-dark rounded-xl p-5 flex flex-col items-center text-center transition-all hover:translate-y-[-5px] group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {integration.id === 'more' ? (
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-dashed border-gray-600">
                  <i className="fas fa-plus text-2xl text-gray-400"></i>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
                  <img src={integration.logoUrl} alt={integration.name} className="w-10 h-10" />
                </div>
              )}
              <h3 className="text-lg font-medium mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
              {integration.id === 'more' ? (
                <span className="text-xs py-1 px-3 rounded-full bg-primary/20 text-primary-400">Browse All</span>
              ) : integration.isActive ? (
                <span className="text-xs py-1 px-3 rounded-full bg-green-500/20 text-green-400">Connected</span>
              ) : (
                <span className="text-xs py-1 px-3 rounded-full bg-gray-700 text-gray-300">Connect</span>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
            <i className="fas fa-cog mr-2"></i> Explore Integration Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
}
