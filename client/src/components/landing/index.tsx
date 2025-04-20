import { motion } from "framer-motion";
import Navbar from "./navbar";
import Hero from "./hero";
import Partners from "./partners";
import Features from "./features";
import DashboardPreview from "./dashboard-preview";
import Integrations from "./integrations";
import AiCore from "./ai-core";
import Testimonials from "./testimonials";
import Pricing from "./pricing";
import Cta from "./cta";
import Footer from "./footer";
import Particles from "../ui/particles";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans custom-scrollbar relative">
      {/* Particle Background */}
      <Particles count={20} />
      
      {/* Blur Backgrounds */}
      <motion.div 
        className="blur-bg bg-primary-500 top-0 left-1/4"
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="blur-bg bg-secondary-500 bottom-0 right-1/4"
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="blur-bg bg-accent-500 top-1/3 right-1/3"
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <DashboardPreview />
      <Integrations />
      <AiCore />
      <Testimonials />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
