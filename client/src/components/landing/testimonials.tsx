import { motion } from "framer-motion";
import GradientText from "../ui/gradient-text";
import Glassmorphism from "../ui/glassmorphism";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
      testimonial: "FluxPay transformed our payment processing with its AI-powered fraud detection. We've seen a 40% reduction in chargebacks and our customers love the seamless checkout experience.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "CTO, GlobalRetail",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      testimonial: "The integration capabilities are phenomenal. We connected FluxPay to our entire tech stack in hours, not weeks. The real-time analytics have given us insights we never had before.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Director, Finance Plus",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
      testimonial: "The KYC automation has been a game-changer for our onboarding process. What used to take days now takes minutes, and the accuracy is better than our manual process.",
      rating: 4.5
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>Trusted by Innovative</GradientText> Businesses
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what our customers are saying about FluxPay's revolutionary payment solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="glassmorphism-dark rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{testimonial.testimonial}</p>
              
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {testimonial.rating % 1 !== 0 && (
                  <i className="fas fa-star-half-alt"></i>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
