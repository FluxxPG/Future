import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Form schema for updating merchant KYC status
const merchantKycSchema = z.object({
  kycStatus: z.string({
    required_error: "Please select a status",
  }),
  rejectionReason: z.string().optional(),
});

export default function Merchants() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Fetch merchants
  const { data: merchants = [], isLoading } = useQuery({
    queryKey: ['/api/admin/merchants'],
    initialData: []
  });
  
  // Update merchant KYC status mutation
  const updateKycMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return apiRequest('PUT', `/api/admin/merchants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/merchants'] });
      toast({
        title: "KYC status updated",
        description: "The merchant's KYC status has been successfully updated",
      });
      setIsKycDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating KYC status",
        description: error.message || "There was an error updating the KYC status",
        variant: "destructive",
      });
    }
  });
  
  // Form setup for KYC status update
  const form = useForm({
    resolver: zodResolver(merchantKycSchema),
    defaultValues: {
      kycStatus: "",
      rejectionReason: "",
    },
  });
  
  // Filter merchants by search query and tab
  const filteredMerchants = merchants.filter(merchant => {
    // First filter by search query
    const matchesSearch = searchQuery.trim() === "" || 
      merchant.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.businessType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.websiteUrl?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then filter by tab
    if (currentTab === "all") return matchesSearch;
    if (currentTab === "approved") return matchesSearch && merchant.kycStatus === "approved";
    if (currentTab === "pending") return matchesSearch && merchant.kycStatus === "pending";
    if (currentTab === "rejected") return matchesSearch && merchant.kycStatus === "rejected";
    
    return matchesSearch;
  });
  
  // Get KYC status badge styling
  const getKycStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/20">
            Not Started
          </Badge>
        );
    }
  };
  
  // Handle KYC status update
  const openKycDialog = (merchant) => {
    setSelectedMerchant(merchant);
    form.reset({
      kycStatus: merchant.kycStatus,
      rejectionReason: merchant.kycData?.rejectionReason || "",
    });
    setIsKycDialogOpen(true);
  };
  
  // Handle view merchant details
  const openDetailsDialog = (merchant) => {
    setSelectedMerchant(merchant);
    setIsDetailsDialogOpen(true);
  };
  
  // Submit KYC status update
  const onSubmitKycUpdate = (data) => {
    // Prepare data for update
    const updateData = {
      kycStatus: data.kycStatus,
      kycData: {
        ...(selectedMerchant.kycData || {}),
        ...(data.kycStatus === "rejected" && data.rejectionReason 
          ? { rejectionReason: data.rejectionReason } 
          : {}),
        reviewedAt: new Date().toISOString(),
        reviewedBy: "admin" // In a real app, this would be the current admin user ID
      }
    };
    
    updateKycMutation.mutate({ id: selectedMerchant.id, data: updateData });
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
      <motion.div 
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold">Merchant Management</h1>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="glassmorphism-dark">
          <CardHeader>
            <CardTitle>Merchant Accounts</CardTitle>
            <CardDescription>
              View and manage merchant accounts, KYC verification, and business details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading merchants...
                      </TableCell>
                    </TableRow>
                  ) : filteredMerchants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchQuery ? "No merchants match your search" : "No merchants found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.id}>
                        <TableCell>
                          <div className="font-medium">{merchant.businessName}</div>
                        </TableCell>
                        <TableCell>{merchant.businessType || "N/A"}</TableCell>
                        <TableCell>
                          {merchant.websiteUrl ? (
                            <a 
                              href={merchant.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline flex items-center"
                            >
                              {merchant.websiteUrl.replace(/^https?:\/\//, '')}
                              <Eye className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>{getKycStatusBadge(merchant.kycStatus)}</TableCell>
                        <TableCell>{new Date(merchant.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openDetailsDialog(merchant)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openKycDialog(merchant)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update KYC Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* KYC Status Update Dialog */}
      <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glassmorphism-dark">
          <DialogHeader>
            <DialogTitle>Update KYC Status</DialogTitle>
            <DialogDescription>
              Review and update the KYC verification status for this merchant
            </DialogDescription>
          </DialogHeader>
          
          {selectedMerchant && (
            <div className="py-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-semibold text-primary">
                    {selectedMerchant.businessName?.charAt(0) || "M"}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{selectedMerchant.businessName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMerchant.businessType || "Business"}
                  </p>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitKycUpdate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="kycStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("kycStatus") === "rejected" && (
                    <FormField
                      control={form.control}
                      name="rejectionReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rejection Reason</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Please provide a reason for rejection"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed to the merchant
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsKycDialogOpen(false)}
                      className="mt-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="mt-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      disabled={updateKycMutation.isPending}
                    >
                      {updateKycMutation.isPending ? "Updating..." : "Update Status"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Merchant Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glassmorphism-dark">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
            <DialogDescription>
              Complete information about the merchant account
            </DialogDescription>
          </DialogHeader>
          
          {selectedMerchant && (
            <div className="py-4">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback className="text-lg">
                      {selectedMerchant.businessName?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMerchant.businessName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">{selectedMerchant.businessType || "Business"}</span>
                      <span>•</span>
                      <span className="text-sm text-muted-foreground">ID: {selectedMerchant.id}</span>
                    </div>
                    <div className="mt-2">{getKycStatusBadge(selectedMerchant.kycStatus)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Information</h4>
                    <Card className="glassmorphism">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Business Name</div>
                          <div>{selectedMerchant.businessName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Business Type</div>
                          <div>{selectedMerchant.businessType || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Website</div>
                          <div>
                            {selectedMerchant.websiteUrl ? (
                              <a 
                                href={selectedMerchant.websiteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                              >
                                {selectedMerchant.websiteUrl}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">KYC Information</h4>
                    <Card className="glassmorphism">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div>{getKycStatusBadge(selectedMerchant.kycStatus)}</div>
                        </div>
                        {selectedMerchant.kycData?.reviewedAt && (
                          <div>
                            <div className="text-xs text-muted-foreground">Last Review</div>
                            <div>{new Date(selectedMerchant.kycData.reviewedAt).toLocaleString()}</div>
                          </div>
                        )}
                        {selectedMerchant.kycStatus === "rejected" && selectedMerchant.kycData?.rejectionReason && (
                          <div>
                            <div className="text-xs text-muted-foreground">Rejection Reason</div>
                            <div className="text-red-400">{selectedMerchant.kycData.rejectionReason}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Activity Timeline</h4>
                  <Card className="glassmorphism">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <div className="h-full w-0.5 bg-border"></div>
                          </div>
                          <div>
                            <div className="font-medium">Account Created</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedMerchant.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {selectedMerchant.kycData?.reviewedAt && (
                          <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <div className="h-full w-0.5 bg-border"></div>
                            </div>
                            <div>
                              <div className="font-medium">KYC Status Update</div>
                              <div className="text-sm">
                                Status changed to <strong>{selectedMerchant.kycStatus}</strong>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(selectedMerchant.kycData.reviewedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openKycDialog(selectedMerchant);
                  }}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Update KYC Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
