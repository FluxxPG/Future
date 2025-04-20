import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet"; // @ts-ignore
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Glassmorphism from "@/components/ui/glassmorphism";

// Form schema
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get redirect URL from query string if it exists
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/auth/login", values);
      const userData = await response.json();
      
      // Store user in localStorage
      localStorage.setItem("fluxpay_user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: "Welcome back to FluxPay!",
      });
      
      // Redirect to dashboard or the requested page
      setLocation(redirectTo);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      <Helmet>
        <title>Login | FluxPay</title>
      </Helmet>
      
      <div className="flex min-h-screen bg-background items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-background bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="glassmorphism-dark border-border/40">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <i className="fas fa-bolt text-white text-xl"></i>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                <Link href="/" className="text-primary hover:underline">
                  Back to Home
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}