import express, { Request, Response, NextFunction, Application } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMerchantSchema, insertTransactionSchema, insertApiKeySchema, insertPaymentLinkSchema, insertSubscriptionSchema, insertMerchantIntegrationSchema } from "@shared/schema";
import { nanoid } from "nanoid";
import { authMiddleware, adminAuthMiddleware } from "./middleware/auth";

// Import and initialize Stripe with secret key
import Stripe from "stripe";
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export async function registerRoutes(app: Application): Promise<Server> {
  const router = express.Router();
  
  // API route prefix
  const apiPrefix = "/api";
  
  // Auth routes
  router.post(`${apiPrefix}/auth/register`, async (req: Request, res: Response) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(userInput.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(userInput.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      // Create user
      const user = await storage.createUser(userInput);
      
      // Create merchant profile if role is merchant
      if (user.role === "merchant") {
        const merchantInput = {
          userId: user.id,
          businessName: req.body.businessName || `${user.username}'s Business`,
          businessType: req.body.businessType || "Other",
          websiteUrl: req.body.websiteUrl || "",
          kycStatus: "pending",
          kycData: {}
        };
        
        await storage.createMerchant(merchantInput);
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post(`${apiPrefix}/auth/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you would set up a JWT token or session here
      // For now, we'll just return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // User routes
  router.get("/users/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Admin routes
  router.get("/admin/users", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return res.status(200).json(usersWithoutPasswords);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.get("/admin/merchants", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const merchants = await storage.getAllMerchants();
      return res.status(200).json(merchants);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.put("/admin/merchants/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const merchantId = parseInt(req.params.id);
      const merchantUpdate = req.body;
      
      const updatedMerchant = await storage.updateMerchant(merchantId, merchantUpdate);
      
      if (!updatedMerchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      
      return res.status(200).json(updatedMerchant);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Merchant routes
  router.get("/merchants/me", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access this resource" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      return res.status(200).json(merchant);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Transaction routes
  router.get("/transactions", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access transactions" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const transactions = await storage.getTransactionsByMerchantId(merchant.id);
      
      return res.status(200).json(transactions);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post("/transactions", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can create transactions" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const transactionInput = {
        ...req.body,
        merchantId: merchant.id
      };
      
      const validatedInput = insertTransactionSchema.parse(transactionInput);
      const transaction = await storage.createTransaction(validatedInput);
      
      return res.status(201).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // API Key routes
  router.get("/api-keys", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access API keys" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const apiKeys = await storage.getApiKeysByMerchantId(merchant.id);
      
      return res.status(200).json(apiKeys);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post("/api-keys", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can create API keys" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const apiKeyInput = {
        merchantId: merchant.id,
        name: req.body.name,
        key: `pk_${nanoid(24)}`,
        isActive: true
      };
      
      const validatedInput = insertApiKeySchema.parse(apiKeyInput);
      const apiKey = await storage.createApiKey(validatedInput);
      
      return res.status(201).json(apiKey);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.delete("/api-keys/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can delete API keys" });
      }
      
      const apiKeyId = parseInt(req.params.id);
      const apiKey = await storage.getApiKey(apiKeyId);
      
      if (!apiKey) {
        return res.status(404).json({ message: "API key not found" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant || apiKey.merchantId !== merchant.id) {
        return res.status(403).json({ message: "You don't have permission to delete this API key" });
      }
      
      await storage.deleteApiKey(apiKeyId);
      
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Payment Link routes
  router.get("/payment-links", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access payment links" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const paymentLinks = await storage.getPaymentLinksByMerchantId(merchant.id);
      
      return res.status(200).json(paymentLinks);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post("/payment-links", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can create payment links" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const paymentLinkInput = {
        ...req.body,
        merchantId: merchant.id
      };
      
      const validatedInput = insertPaymentLinkSchema.parse(paymentLinkInput);
      const paymentLink = await storage.createPaymentLink(validatedInput);
      
      return res.status(201).json(paymentLink);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Subscription routes
  router.get("/subscriptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access subscriptions" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const subscriptions = await storage.getSubscriptionsByMerchantId(merchant.id);
      
      return res.status(200).json(subscriptions);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post("/subscriptions", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can create subscriptions" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const subscriptionInput = {
        ...req.body,
        merchantId: merchant.id
      };
      
      const validatedInput = insertSubscriptionSchema.parse(subscriptionInput);
      const subscription = await storage.createSubscription(validatedInput);
      
      return res.status(201).json(subscription);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Integration routes
  router.get("/integrations", async (req: Request, res: Response) => {
    try {
      const integrations = await storage.getAllIntegrations();
      return res.status(200).json(integrations);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.get("/merchant-integrations", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can access integrations" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const merchantIntegrations = await storage.getMerchantIntegrationsByMerchantId(merchant.id);
      
      return res.status(200).json(merchantIntegrations);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  router.post("/merchant-integrations", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can create integrations" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const merchantIntegrationInput = {
        merchantId: merchant.id,
        integrationId: req.body.integrationId,
        isActive: true,
        config: req.body.config || {}
      };
      
      const validatedInput = insertMerchantIntegrationSchema.parse(merchantIntegrationInput);
      const merchantIntegration = await storage.createMerchantIntegration(validatedInput);
      
      return res.status(201).json(merchantIntegration);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // KYC routes
  router.post("/kyc", authMiddleware, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "merchant") {
        return res.status(403).json({ message: "Only merchants can submit KYC" });
      }
      
      const merchant = await storage.getMerchantByUserId(req.user.id);
      
      if (!merchant) {
        return res.status(404).json({ message: "Merchant profile not found" });
      }
      
      const kycData = req.body;
      
      const updatedMerchant = await storage.updateMerchant(merchant.id, {
        kycData,
        kycStatus: "pending"
      });
      
      return res.status(200).json(updatedMerchant);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Stripe payment routes
  router.post(`${apiPrefix}/create-payment-intent`, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
      
      // Check if we have a Stripe secret key
      if (!process.env.STRIPE_SECRET_KEY || !stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      // Create a real payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      
      return res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        currency: "usd",
        status: "succeeded"
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Error creating payment intent" });
    }
  });
  
  // Register all the routes without additional prefix since we already added it to each route
  app.use(router);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
