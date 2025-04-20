import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Copy, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Form schema for creating payment link
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1.",
  }),
  currency: z.string().default("USD"),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export default function PaymentLinks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch payment links
  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ['/api/payment-links'],
    initialData: []
  });
  
  // Create payment link mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/payment-links', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-links'] });
      toast({
        title: "Success!",
        description: "Payment link created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment link",
        variant: "destructive",
      });
    }
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      currency: "USD",
      isActive: true,
      expiresAt: "",
    },
  });
  
  // Form submission handler
  function onSubmit(values) {
    createMutation.mutate(values);
  }
  
  // Copy payment link to clipboard
  const copyToClipboard = (id) => {
    const linkUrl = `https://fluxpay.com/pay/${id}`;
    navigator.clipboard.writeText(linkUrl);
    toast({
      title: "Link copied!",
      description: "Payment link copied to clipboard",
    });
  };
  
  // Delete payment link
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('DELETE', `/api/payment-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-links'] });
      toast({
        title: "Success!",
        description: "Payment link deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment link",
        variant: "destructive",
      });
    }
  });
  
  // Generate payment link URL
  const generateLinkUrl = (id) => {
    return `https://fluxpay.com/pay/${id}`;
  };
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Links</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Payment Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glassmorphism-dark">
            <DialogHeader>
              <DialogTitle>Create Payment Link</DialogTitle>
              <DialogDescription>
                Create a shareable payment link for your customers
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Sale" {...field} />
                      </FormControl>
                      <FormDescription>
                        The title of your payment link
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Special summer discount for loyal customers" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="99.99" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="USD" 
                            {...field} 
                            className="w-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expire Date (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Make this payment link immediately available
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="mt-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="mt-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Link"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <motion.div
        variants={itemVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glassmorphism-dark animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))
        ) : paymentLinks.length === 0 ? (
          // Empty state
          <Card className="col-span-full p-8 glassmorphism-dark text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full p-3 bg-primary/10 mb-4">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No payment links yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first payment link to share with your customers
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Create Payment Link
              </Button>
            </div>
          </Card>
        ) : (
          // Display payment links
          paymentLinks.map((link, index) => (
            <motion.div key={link.id} variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created on {new Date(link.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => copyToClipboard(link.id)}
                          className="cursor-pointer"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => window.open(generateLinkUrl(link.id), '_blank')}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMutation.mutate(link.id)}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-0 right-0 mt-3 mr-12">
                    <div className={`h-2 w-2 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    {link.currency} {link.amount ? link.amount / 100 : '0.00'}
                  </div>
                  {link.description && (
                    <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {link.expiresAt ? (
                        <span>Expires: {new Date(link.expiresAt).toLocaleDateString()}</span>
                      ) : (
                        <span>No expiration</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.id)}
                      className="flex items-center"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
