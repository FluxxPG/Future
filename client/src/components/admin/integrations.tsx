import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Search, 
  Check, 
  X, 
  Edit, 
  Trash2,
  ExternalLink,
  Code 
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

// Form schema for creating/editing integration
const integrationSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  logoUrl: z.string().url({
    message: "Please enter a valid URL for the logo.",
  }),
  category: z.string().min(2, {
    message: "Please select a category.",
  }),
  isActive: z.boolean().default(true),
  config: z.any().optional(),
});

export default function Integrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  
  // Fetch integrations
  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['/api/integrations'],
    initialData: []
  });
  
  // Create integration mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/integrations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      toast({
        title: "Integration created successfully",
        description: "The new integration has been added to the system",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating integration",
        description: error.message || "There was an error creating the integration",
        variant: "destructive",
      });
    }
  });
  
  // Update integration mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return apiRequest('PUT', `/api/integrations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      toast({
        title: "Integration updated successfully",
        description: "The integration information has been updated",
      });
      setIsEditDialogOpen(false);
      setSelectedIntegration(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating integration",
        description: error.message || "There was an error updating the integration",
        variant: "destructive",
      });
    }
  });
  
  // Delete integration mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('DELETE', `/api/integrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      toast({
        title: "Integration deleted successfully",
        description: "The integration has been removed from the system",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting integration",
        description: error.message || "There was an error deleting the integration",
        variant: "destructive",
      });
    }
  });
  
  // Toggle integration status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      return apiRequest('PUT', `/api/integrations/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      toast({
        title: "Integration status updated",
        description: "The integration status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message || "There was an error updating the integration status",
        variant: "destructive",
      });
    }
  });
  
  // Create form
  const form = useForm({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      category: "",
      isActive: true,
      config: {},
    },
  });
  
  // Edit form
  const editForm = useForm({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      category: "",
      isActive: true,
      config: {},
    },
  });
  
  // Submit create form
  const onSubmitCreate = (data) => {
    // Convert config field to JSON object
    try {
      if (typeof data.config === "string" && data.config.trim() !== "") {
        data.config = JSON.parse(data.config);
      } else {
        data.config = {};
      }
    } catch (error) {
      toast({
        title: "Invalid JSON in config",
        description: "Please check your JSON configuration syntax",
        variant: "destructive",
      });
      return;
    }
    
    createMutation.mutate(data);
  };
  
  // Submit edit form
  const onSubmitEdit = (data) => {
    // Convert config field to JSON object
    try {
      if (typeof data.config === "string" && data.config.trim() !== "") {
        data.config = JSON.parse(data.config);
      } else {
        data.config = {};
      }
    } catch (error) {
      toast({
        title: "Invalid JSON in config",
        description: "Please check your JSON configuration syntax",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({ id: selectedIntegration.id, data });
  };
  
  // Open edit dialog and populate form
  const handleEditIntegration = (integration) => {
    setSelectedIntegration(integration);
    editForm.reset({
      name: integration.name,
      description: integration.description,
      logoUrl: integration.logoUrl,
      category: integration.category,
      isActive: integration.isActive,
      config: JSON.stringify(integration.config || {}, null, 2),
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle toggle integration status
  const handleToggleStatus = (integration) => {
    toggleStatusMutation.mutate({ 
      id: integration.id, 
      isActive: !integration.isActive 
    });
  };
  
  // Filter integrations by search query
  const filteredIntegrations = integrations.filter(integration => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      integration.name.toLowerCase().includes(query) ||
      integration.description.toLowerCase().includes(query) ||
      integration.category.toLowerCase().includes(query)
    );
  });
  
  // Get category badge styling
  const getCategoryBadge = (category) => {
    const categoryStyling = {
      "ecommerce": "bg-blue-500/20 text-blue-400 border-blue-500/20",
      "crm": "bg-purple-500/20 text-purple-400 border-purple-500/20",
      "communication": "bg-green-500/20 text-green-400 border-green-500/20",
      "analytics": "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      "payment": "bg-red-500/20 text-red-400 border-red-500/20",
      "cloud": "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
      "other": "bg-gray-500/20 text-gray-400 border-gray-500/20"
    };
    
    return categoryStyling[category.toLowerCase()] || categoryStyling.other;
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

  // Categories for form select
  const categories = [
    { value: "ecommerce", label: "E-commerce" },
    { value: "crm", label: "CRM" },
    { value: "communication", label: "Communication" },
    { value: "analytics", label: "Analytics" },
    { value: "payment", label: "Payment" },
    { value: "cloud", label: "Cloud Services" },
    { value: "other", label: "Other" }
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold">Integration Management</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] glassmorphism-dark">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
              <DialogDescription>
                Create a new integration that merchants can connect to their FluxPay account
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Integration Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Shopify" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Integrate payments directly with your Shopify store"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://cdn.example.com/logo.svg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to the integration's logo (SVG format preferred)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="config"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="{}"
                          className="font-mono text-xs h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Configuration parameters in JSON format
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
                          Make this integration available to merchants
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
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="mt-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="mt-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Integration"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="glassmorphism-dark animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-10 bg-gray-700 rounded-full w-10 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-700 rounded mb-2"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-700 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))
          ) : filteredIntegrations.length === 0 ? (
            <div className="col-span-full">
              <Card className="glassmorphism-dark p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full p-3 bg-primary/10 mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No integrations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No integrations match your search" : "Add your first integration to get started"}
                  </p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="glassmorphism-dark overflow-hidden">
                <div className={`h-1 ${integration.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 overflow-hidden">
                        <img 
                          src={integration.logoUrl} 
                          alt={integration.name} 
                          className="w-6 h-6"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${getCategoryBadge(integration.category)}`}
                        >
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {integration.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(integration)}
                      className={integration.isActive ? "text-green-500" : "text-gray-500"}
                    >
                      {integration.isActive ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Active
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" /> Inactive
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditIntegration(integration)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glassmorphism-dark">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Integration</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {integration.name}? This action cannot be undone and may affect merchants who are using this integration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(integration.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </motion.div>
      
      {/* Edit Integration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glassmorphism-dark">
          <DialogHeader>
            <DialogTitle>Edit Integration</DialogTitle>
            <DialogDescription>
              Update the integration details and configuration settings
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Integration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Shopify" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Integrate payments directly with your Shopify store"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://cdn.example.com/logo.svg" {...field} />
                    </FormControl>
                    {field.value && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                          <img 
                            src={field.value} 
                            alt="Logo Preview" 
                            className="max-w-full max-h-full"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
                            }}
                          />
                        </div>
                        <a 
                          href={field.value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          Preview <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="config"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration (JSON)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="{}"
                        className="font-mono text-xs h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Configuration parameters in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Make this integration available to merchants
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
                  onClick={() => setIsEditDialogOpen(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="mt-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Integration"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
