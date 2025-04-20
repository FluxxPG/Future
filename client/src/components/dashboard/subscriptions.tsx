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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, CalendarClock, Edit, Trash2, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Form schema for creating subscription
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1.",
  }),
  currency: z.string().default("USD"),
  interval: z.string().min(1, {
    message: "Please select an interval.",
  }),
  isActive: z.boolean().default(true),
  metadata: z.any().optional(),
});

export default function Subscriptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['/api/subscriptions'],
    initialData: []
  });
  
  // Create subscription mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/subscriptions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscriptions'] });
      toast({
        title: "Success!",
        description: "Subscription plan created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription plan",
        variant: "destructive",
      });
    }
  });
  
  // Delete subscription mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('DELETE', `/api/subscriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscriptions'] });
      toast({
        title: "Success!",
        description: "Subscription plan deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription plan",
        variant: "destructive",
      });
    }
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      currency: "USD",
      interval: "",
      isActive: true,
      metadata: {}
    },
  });
  
  // Form submission handler
  function onSubmit(values) {
    // Convert amount to cents
    const dataToSubmit = {
      ...values,
      amount: Math.round(values.amount * 100)
    };
    createMutation.mutate(dataToSubmit);
  }
  
  // Helper function to format interval
  const formatInterval = (interval) => {
    switch (interval) {
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      case "year":
        return "Yearly";
      default:
        return interval;
    }
  };
  
  // Helper function to format amount
  const formatAmount = (amount, currency) => {
    return `${currency} ${(amount / 100).toFixed(2)}`;
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
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Subscription Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glassmorphism-dark">
            <DialogHeader>
              <DialogTitle>Create Subscription Plan</DialogTitle>
              <DialogDescription>
                Create a recurring subscription plan for your products or services
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Premium Plan" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your subscription plan
                      </FormDescription>
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
                            placeholder="9.99" 
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
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Interval</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Daily</SelectItem>
                          <SelectItem value="week">Weekly</SelectItem>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often should customers be billed
                      </FormDescription>
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
                          Make this subscription plan immediately available
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
                    {createMutation.isPending ? "Creating..." : "Create Plan"}
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
        ) : subscriptions.length === 0 ? (
          // Empty state
          <Card className="col-span-full p-8 glassmorphism-dark text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full p-3 bg-primary/10 mb-4">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No subscription plans yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first subscription plan to start offering recurring billing
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Create Subscription Plan
              </Button>
            </div>
          </Card>
        ) : (
          // Display subscription plans
          subscriptions.map((subscription) => (
            <motion.div key={subscription.id} variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader className="relative pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{subscription.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {formatInterval(subscription.interval)} billing
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
                          onClick={() => {}}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMutation.mutate(subscription.id)}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-0 right-0 mt-3 mr-12">
                    <div className={`h-2 w-2 rounded-full ${subscription.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-3">
                    {formatAmount(subscription.amount, subscription.currency)}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    <span>Created {new Date(subscription.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className={`h-4 w-4 mr-1 ${subscription.isActive ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${subscription.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                      className="flex items-center"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
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
