import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import GradientText from '@/components/ui/gradient-text';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export default function Checkout() {
  const [amount, setAmount] = useState(99.99);
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // In a real app, these would come from the product being purchased
  const productName = "FluxPay Pro Plan";
  const productDescription = "Monthly subscription to FluxPay Pro Plan with all premium features";
  
  async function handlePayment() {
    setIsLoading(true);
    
    try {
      // Call our API to create a payment intent
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: amount
      });
      
      const paymentData = await response.json();
      
      // In a real app with Stripe Elements, we would use the clientSecret
      // to confirm the payment, but for now we'll simulate a success
      console.log('Payment Intent created:', paymentData);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Payment Successful!",
        description: "Thank you for your purchase. Your payment has been processed successfully.",
      });
      
      // In a real app, you'd redirect to a success page or back to dashboard
      // setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | FluxPay</title>
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
          <Card className="backdrop-blur-lg bg-background/80 border border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                  <span className="text-white text-xl">💸</span>
                </div>
                <GradientText>Complete Your Purchase</GradientText>
              </CardTitle>
              <CardDescription className="text-center">
                Secure payment powered by FluxPay
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium text-sm max-w-[200px] text-right">{productDescription}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">
                    ${amount.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
              
              <div className="border border-primary/20 rounded-lg p-4 bg-gradient-to-br from-background to-muted/30">
                <h3 className="text-sm font-medium mb-3">Payment Method</h3>
                
                {/* In a real app, this would be Stripe Elements */}
                <div className="space-y-3">
                  <div className="rounded-md border border-border p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span>💳</span>
                      </div>
                      <span>Credit Card</span>
                    </div>
                    <input type="radio" checked readOnly className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handlePayment} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)} ${currency}`}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}