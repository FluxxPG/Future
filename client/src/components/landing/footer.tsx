import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Footer() {
  const footerLinks = {
    products: [
      { label: "Payment Processing", href: "#" },
      { label: "Subscriptions", href: "#" },
      { label: "Fraud Protection", href: "#" },
      { label: "Payment Links", href: "#" },
      { label: "Integrations", href: "#" }
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Support", href: "#" }
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" }
    ],
    legal: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Legal", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-linkedin", href: "#" },
    { icon: "fab fa-github", href: "#" },
    { icon: "fab fa-facebook", href: "#" }
  ];

  return (
    <footer className="py-12 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-3">
                <i className="fas fa-bolt text-white"></i>
              </div>
              <span className="text-2xl font-bold gradient-text">FluxPay</span>
            </div>
            <p className="text-gray-400 mb-4">
              The AI-powered payment gateway that streamlines your transactions and supercharges your business growth.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Social link ${index + 1}`}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} FluxPay. All rights reserved.</div>
          <div className="flex space-x-6">
            {footerLinks.legal.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
