import { motion } from "framer-motion";

export default function Partners() {
  const partners = [
    { name: "Apple", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
    { name: "Google", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
    { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
    { name: "Slack", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
    { name: "Shopify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg" },
    { name: "Salesforce", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg" }
  ];

  return (
    <section className="py-12 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.p 
          className="text-center text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Trusted by innovative companies worldwide
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
          {partners.map((partner, index) => (
            <motion.img
              key={partner.name}
              src={partner.logo}
              alt={partner.name}
              className="h-8 grayscale hover:grayscale-0 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
