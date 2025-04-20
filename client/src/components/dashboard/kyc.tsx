import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { 
  CloudUpload, 
  Camera, 
  Shield, 
  Fingerprint, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Upload, 
  RefreshCcw 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Glassmorphism from "../ui/glassmorphism";

// Form schema for KYC submission
const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  dateOfBirth: z.string().min(3, {
    message: "Please enter your date of birth.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  documentType: z.string().min(2, {
    message: "Please select a document type.",
  }),
  documentNumber: z.string().min(3, {
    message: "Document number is required.",
  }),
  documentImage: z.any().optional(),
  selfieImage: z.any().optional(),
});

export default function Kyc() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [kycStatus, setKycStatus] = useState("pending"); // pending, approved, rejected, not_started
  const [documentPreview, setDocumentPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  
  // Get merchant profile and KYC status
  const { data: merchant, isLoading } = useQuery({
    queryKey: ['/api/merchants/me'],
    initialData: {
      kycStatus: "not_started",
      kycData: {}
    }
  });
  
  // Submit KYC data mutation
  const kycMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/kyc', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/merchants/me'] });
      toast({
        title: "KYC submitted successfully!",
        description: "Your verification documents are being reviewed.",
      });
      setKycStatus("pending");
    },
    onError: (error) => {
      toast({
        title: "Error submitting KYC",
        description: error.message || "There was an error submitting your verification documents.",
        variant: "destructive",
      });
    }
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      documentType: "passport",
      documentNumber: "",
      documentImage: null,
      selfieImage: null,
    },
  });
  
  // Form submission handler
  function onSubmit(values) {
    // In a real app, you would upload the images first, then submit the form with the URLs
    const kycData = {
      ...values,
      // Convert File objects to file information (name, size, type)
      documentImage: values.documentImage ? {
        name: values.documentImage.name,
        size: values.documentImage.size,
        type: values.documentImage.type,
        // In a real app, this would be the URL after uploading
        url: "https://example.com/document-image.jpg"
      } : null,
      selfieImage: values.selfieImage ? {
        name: values.selfieImage.name,
        size: values.selfieImage.size,
        type: values.selfieImage.type,
        url: "https://example.com/selfie-image.jpg"
      } : null,
    };
    
    kycMutation.mutate(kycData);
  }
  
  // Next step handler
  const handleNextStep = () => {
    form.trigger(['fullName', 'dateOfBirth', 'address']);
    const hasErrors = !!form.formState.errors.fullName || 
                      !!form.formState.errors.dateOfBirth || 
                      !!form.formState.errors.address;
    
    if (!hasErrors) {
      setStep(2);
    }
  };
  
  // Handle document image upload
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('documentImage', file);
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle selfie image upload
  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('selfieImage', file);
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Restart KYC process
  const handleRestart = () => {
    form.reset();
    setDocumentPreview(null);
    setSelfiePreview(null);
    setStep(1);
  };
  
  // Status components
  const StatusCard = ({ status, lastUpdated }) => {
    return (
      <Card className="glassmorphism-dark">
        <CardHeader>
          <CardTitle>KYC Status</CardTitle>
          <CardDescription>
            Your verification status and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            {status === "approved" ? (
              <div className="p-3 rounded-full bg-green-500/20 mr-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            ) : status === "rejected" ? (
              <div className="p-3 rounded-full bg-red-500/20 mr-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            ) : status === "pending" ? (
              <div className="p-3 rounded-full bg-yellow-500/20 mr-4">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-gray-500/20 mr-4">
                <Shield className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <div>
              <h3 className="font-medium">
                {status === "approved" 
                  ? "Verification Complete" 
                  : status === "rejected"
                  ? "Verification Failed"
                  : status === "pending"
                  ? "Under Review"
                  : "Not Started"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lastUpdated 
                  ? `Last updated: ${new Date(lastUpdated).toLocaleDateString()}`
                  : "Submit your documents to get verified"}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Progress</span>
                <span>
                  {status === "approved" 
                    ? "100%" 
                    : status === "rejected"
                    ? "0%"
                    : status === "pending"
                    ? "75%"
                    : "0%"}
                </span>
              </div>
              <Progress 
                value={
                  status === "approved" 
                    ? 100 
                    : status === "rejected"
                    ? 0
                    : status === "pending"
                    ? 75
                    : 0
                } 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Requirements</div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Government ID or Passport</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Selfie Verification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Address Verification</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {(status === "rejected" || status === "not_started") && (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={handleRestart}
            >
              {status === "rejected" ? "Try Again" : "Start Verification"}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
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

  // If we're loading, show a loading card
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <Card className="glassmorphism-dark animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-16 bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-gray-700 rounded mb-2"></div>
              <div className="h-24 bg-gray-700 rounded mb-2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <StatusCard 
            status={merchant.kycStatus} 
            lastUpdated={merchant.updatedAt}
          />
        </motion.div>
        
        {/* KYC Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {merchant.kycStatus === "approved" ? (
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Verification Complete</CardTitle>
                <CardDescription>
                  Your identity has been verified successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full p-5 bg-green-500/20 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">You're Good to Go!</h3>
                  <p className="text-center text-muted-foreground max-w-md mb-6">
                    Your account has been fully verified, and you can now use all features of the FluxPay platform.
                  </p>
                  <Button variant="outline">View Verification Details</Button>
                </div>
              </CardContent>
            </Card>
          ) : merchant.kycStatus === "rejected" ? (
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Verification Failed</CardTitle>
                <CardDescription>
                  Your submitted documents didn't meet our requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full p-5 bg-red-500/20 mb-4">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Verification Rejected</h3>
                  <p className="text-center text-muted-foreground max-w-md mb-6">
                    {merchant.kycData.rejectionReason || "We couldn't verify your documents. Please try again with clearer images or different documents."}
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={handleRestart}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Restart Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : merchant.kycStatus === "pending" ? (
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Verification in Progress</CardTitle>
                <CardDescription>
                  Your documents are being reviewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full p-5 bg-yellow-500/20 mb-4">
                    <Clock className="h-10 w-10 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Under Review</h3>
                  <p className="text-center text-muted-foreground max-w-md mb-6">
                    Our team is reviewing your documents. This usually takes 1-2 business days. We'll notify you once the verification is complete.
                  </p>
                  <div className="w-full max-w-md mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Verification Progress</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Complete KYC Verification</CardTitle>
                <CardDescription>
                  Verify your identity to unlock all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    {step === 1 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Step 1: Personal Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Legal Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Residential Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="123 Main St, City, Country" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4 flex justify-end">
                          <Button 
                            type="button" 
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            onClick={handleNextStep}
                          >
                            Next Step
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Step 2: Document Verification</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="documentType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <FormControl>
                                  <select 
                                    className="w-full rounded-md px-3 py-2 bg-muted text-foreground border border-border"
                                    {...field}
                                  >
                                    <option value="passport">Passport</option>
                                    <option value="national_id">National ID</option>
                                    <option value="driving_license">Driving License</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="documentNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="AB123456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <FormItem>
                            <FormLabel>Upload ID Document</FormLabel>
                            <FormDescription>
                              Upload a clear image of your document (front side)
                            </FormDescription>
                            
                            <div className="mt-2">
                              {documentPreview ? (
                                <div className="relative">
                                  <img 
                                    src={documentPreview} 
                                    alt="Document preview" 
                                    className="w-full h-44 object-cover rounded-md"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      setDocumentPreview(null);
                                      form.setValue('documentImage', null);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                  onClick={() => document.getElementById('document-upload').click()}
                                >
                                  <CloudUpload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground/70">
                                    (PNG, JPG up to 5MB)
                                  </p>
                                  <input 
                                    id="document-upload"
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleDocumentUpload}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <FormMessage />
                          </FormItem>
                          
                          <FormItem>
                            <FormLabel>Take a Selfie</FormLabel>
                            <FormDescription>
                              Take a clear photo of your face for verification
                            </FormDescription>
                            
                            <div className="mt-2">
                              {selfiePreview ? (
                                <div className="relative">
                                  <img 
                                    src={selfiePreview} 
                                    alt="Selfie preview" 
                                    className="w-full h-44 object-cover rounded-md"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      setSelfiePreview(null);
                                      form.setValue('selfieImage', null);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                  onClick={() => document.getElementById('selfie-upload').click()}
                                >
                                  <Camera className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Click to take a selfie or upload
                                  </p>
                                  <p className="text-xs text-muted-foreground/70">
                                    (Make sure your face is clearly visible)
                                  </p>
                                  <input 
                                    id="selfie-upload"
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleSelfieUpload}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <FormMessage />
                          </FormItem>
                        </div>
                        
                        <Glassmorphism className="p-4 rounded-md mt-4">
                          <div className="flex items-start">
                            <Fingerprint className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">AI-Powered Verification</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Our advanced AI algorithms will compare your selfie with your ID document to verify your identity instantly.
                              </p>
                            </div>
                          </div>
                        </Glassmorphism>
                        
                        <div className="pt-4 flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          <Button 
                            type="button" 
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            disabled={!documentPreview || !selfiePreview || kycMutation.isPending}
                            onClick={form.handleSubmit(onSubmit)}
                          >
                            {kycMutation.isPending ? (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Submit Documents
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
