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
import { Key, Copy, Eye, EyeOff, Trash2, Shield, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form schema for creating API key
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
});

export default function ApiKeys() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['/api/api-keys'],
    initialData: []
  });
  
  // Create API key mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/api-keys', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      toast({
        title: "Success!",
        description: "API key created successfully. Make sure to copy your key now, you won't be able to see it again!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      });
    }
  });
  
  // Delete API key mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('DELETE', `/api/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      toast({
        title: "Success!",
        description: "API key deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      });
    }
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  
  // Form submission handler
  function onSubmit(values) {
    createMutation.mutate(values);
  }
  
  // Copy API key to clipboard
  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API key copied!",
      description: "API key copied to clipboard",
    });
  };
  
  // Toggle key visibility
  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  // Format and mask API key
  const formatApiKey = (key, isVisible) => {
    if (isVisible) {
      return key;
    }
    // Show only first 3 and last 4 characters
    return `${key.substring(0, 3)}${'•'.repeat(Math.max(0, key.length - 7))}${key.substring(key.length - 4)}`;
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
        <h1 className="text-2xl font-bold">API Keys</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Key className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glassmorphism-dark">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your integrations
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Production API Key" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name to identify this API key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-yellow-900/20 border border-yellow-600/20 rounded-md p-4 text-yellow-500">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Security Warning</p>
                      <p className="text-sm mt-1">
                        Your API key will only be displayed once after creation. Please store it securely as it provides access to your account.
                      </p>
                    </div>
                  </div>
                </div>
                
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
                    {createMutation.isPending ? "Creating..." : "Create API Key"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        {isLoading ? (
          // Loading state
          <Card className="glassmorphism-dark animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ) : apiKeys.length === 0 ? (
          // Empty state
          <Card className="p-8 glassmorphism-dark text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full p-3 bg-primary/10 mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No API keys yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to integrate with your applications
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Create API Key
              </Button>
            </div>
          </Card>
        ) : (
          // Display API keys
          apiKeys.map((apiKey) => (
            <motion.div key={apiKey.id} variants={itemVariants}>
              <Card className="glassmorphism-dark">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{apiKey.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsed && ` • Last used on ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glassmorphism-dark">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API key? This action cannot be undone and may break integrations that use this key.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(apiKey.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md mb-4">
                    <code className="font-mono text-sm">
                      {formatApiKey(apiKey.key, visibleKeys[apiKey.id])}
                    </code>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        title={visibleKeys[apiKey.id] ? "Hide key" : "Show key"}
                      >
                        {visibleKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey.key)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className={`h-4 w-4 mr-1 ${apiKey.isActive ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${apiKey.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Prefix: <code className="font-mono">{apiKey.key.substring(0, 3)}</code>
                    </div>
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
