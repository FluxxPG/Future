import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileEdit, 
  Globe, 
  Image, 
  LayoutGrid, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Cms() {
  const [activeTab, setActiveTab] = useState("pages");
  const { toast } = useToast();
  
  const handleSaveContent = () => {
    toast({
      title: "Content updated",
      description: "Your changes have been saved successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CMS Management</h1>
        <Button
          onClick={handleSaveContent}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-1/2">
          <TabsTrigger value="pages">
            <FileEdit className="h-4 w-4 mr-2" /> Pages
          </TabsTrigger>
          <TabsTrigger value="blocks">
            <LayoutGrid className="h-4 w-4 mr-2" /> Blocks
          </TabsTrigger>
          <TabsTrigger value="media">
            <Image className="h-4 w-4 mr-2" /> Media
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="h-4 w-4 mr-2" /> SEO
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <TabsContent value="pages">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Website Pages</CardTitle>
                  <CardDescription>
                    Edit content for the public-facing website pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Homepage</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Hero Title</Label>
                        <Input 
                          id="hero-title"
                          defaultValue="Next-Gen AI Payment Gateway for Modern Businesses"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                        <Textarea 
                          id="hero-subtitle"
                          defaultValue="Harness the power of artificial intelligence to optimize your payment flows, reduce fraud, and increase conversions."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="features-title">Features Section Title</Label>
                        <Input 
                          id="features-title"
                          defaultValue="Cutting-edge Features"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">About Page</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="about-title">Page Title</Label>
                        <Input 
                          id="about-title"
                          defaultValue="About FluxPay"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="about-content">Page Content</Label>
                        <Textarea 
                          id="about-content"
                          className="min-h-[200px]"
                          defaultValue="FluxPay is a cutting-edge payment gateway that leverages artificial intelligence to provide secure, efficient, and intelligent payment processing for businesses of all sizes. Founded in 2023, we're on a mission to revolutionize the way payments are handled in the digital economy."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="blocks">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Content Blocks</CardTitle>
                  <CardDescription>
                    Edit reusable content blocks that appear across the site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Testimonials</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testimonials-title">Section Title</Label>
                        <Input 
                          id="testimonials-title"
                          defaultValue="What Our Customers Say"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 border rounded-md">
                          <Label htmlFor="testimonial1-name">Name</Label>
                          <Input 
                            id="testimonial1-name"
                            defaultValue="Jane Smith"
                          />
                          <Label htmlFor="testimonial1-company">Company</Label>
                          <Input 
                            id="testimonial1-company"
                            defaultValue="Tech Innovators Inc."
                          />
                          <Label htmlFor="testimonial1-quote">Quote</Label>
                          <Textarea 
                            id="testimonial1-quote"
                            defaultValue="FluxPay has transformed how we handle payments. Their AI-based fraud detection has saved us thousands."
                          />
                        </div>
                        
                        <div className="space-y-2 p-4 border rounded-md">
                          <Label htmlFor="testimonial2-name">Name</Label>
                          <Input 
                            id="testimonial2-name"
                            defaultValue="Mark Johnson"
                          />
                          <Label htmlFor="testimonial2-company">Company</Label>
                          <Input 
                            id="testimonial2-company"
                            defaultValue="E-Shop Global"
                          />
                          <Label htmlFor="testimonial2-quote">Quote</Label>
                          <Textarea 
                            id="testimonial2-quote"
                            defaultValue="The subscription management tools have made recurring billing a breeze. Highly recommended!"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Call to Action</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cta-title">CTA Title</Label>
                        <Input 
                          id="cta-title"
                          defaultValue="Ready to revolutionize your payments?"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cta-text">CTA Text</Label>
                        <Textarea 
                          id="cta-text"
                          defaultValue="Join thousands of businesses that trust FluxPay for their payment processing needs."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cta-button">Button Text</Label>
                        <Input 
                          id="cta-button"
                          defaultValue="Get Started for Free"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="media">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>Media Library</CardTitle>
                  <CardDescription>
                    Manage images and media files used across the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Uploaded Images</h3>
                      <Button variant="outline">Upload New</Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <div 
                          key={index} 
                          className="relative group aspect-square bg-slate-800 rounded-md overflow-hidden flex items-center justify-center"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                          <Image className="h-8 w-8 text-slate-400" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="seo">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Configure search engine optimization settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Global SEO</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="site-title">Site Title</Label>
                        <Input 
                          id="site-title"
                          defaultValue="FluxPay | AI-Powered Payment Gateway"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meta-description">Meta Description</Label>
                        <Textarea 
                          id="meta-description"
                          defaultValue="FluxPay is a cutting-edge payment gateway that uses AI to provide secure, efficient payment processing for modern businesses."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input 
                          id="keywords"
                          defaultValue="payment gateway, AI payments, secure payments, merchant services, online payments"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Social Media</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="og-title">Open Graph Title</Label>
                        <Input 
                          id="og-title"
                          defaultValue="FluxPay - The Future of Digital Payments"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="og-description">Open Graph Description</Label>
                        <Textarea 
                          id="og-description"
                          defaultValue="Experience the next generation of payment processing with FluxPay's AI-powered platform."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="twitter-title">Twitter Card Title</Label>
                        <Input 
                          id="twitter-title"
                          defaultValue="FluxPay - Intelligent Payment Solutions"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}