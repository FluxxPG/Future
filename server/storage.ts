import { nanoid } from "nanoid";
import { 
  users, type User, type InsertUser,
  merchants, type Merchant, type InsertMerchant,
  transactions, type Transaction, type InsertTransaction,
  apiKeys, type ApiKey, type InsertApiKey,
  paymentLinks, type PaymentLink, type InsertPaymentLink,
  subscriptions, type Subscription, type InsertSubscription,
  integrations, type Integration, type InsertIntegration,
  merchantIntegrations, type MerchantIntegration, type InsertMerchantIntegration
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Merchant operations
  getMerchant(id: number): Promise<Merchant | undefined>;
  getMerchantByUserId(userId: number): Promise<Merchant | undefined>;
  getAllMerchants(): Promise<Merchant[]>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  updateMerchant(id: number, merchant: Partial<InsertMerchant>): Promise<Merchant | undefined>;
  deleteMerchant(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByMerchantId(merchantId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  
  // API Key operations
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  getApiKeysByMerchantId(merchantId: number): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: number, apiKey: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<boolean>;
  
  // Payment Link operations
  getPaymentLink(id: number): Promise<PaymentLink | undefined>;
  getPaymentLinksByMerchantId(merchantId: number): Promise<PaymentLink[]>;
  createPaymentLink(paymentLink: InsertPaymentLink): Promise<PaymentLink>;
  updatePaymentLink(id: number, paymentLink: Partial<InsertPaymentLink>): Promise<PaymentLink | undefined>;
  deletePaymentLink(id: number): Promise<boolean>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByMerchantId(merchantId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<boolean>;
  
  // Integration operations
  getIntegration(id: number): Promise<Integration | undefined>;
  getAllIntegrations(): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, integration: Partial<InsertIntegration>): Promise<Integration | undefined>;
  
  // Merchant Integration operations
  getMerchantIntegration(id: number): Promise<MerchantIntegration | undefined>;
  getMerchantIntegrationsByMerchantId(merchantId: number): Promise<MerchantIntegration[]>;
  createMerchantIntegration(merchantIntegration: InsertMerchantIntegration): Promise<MerchantIntegration>;
  updateMerchantIntegration(id: number, merchantIntegration: Partial<InsertMerchantIntegration>): Promise<MerchantIntegration | undefined>;
  deleteMerchantIntegration(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private merchants: Map<number, Merchant>;
  private transactions: Map<number, Transaction>;
  private apiKeys: Map<number, ApiKey>;
  private paymentLinks: Map<number, PaymentLink>;
  private subscriptions: Map<number, Subscription>;
  private integrations: Map<number, Integration>;
  private merchantIntegrations: Map<number, MerchantIntegration>;
  
  private currentUserId: number;
  private currentMerchantId: number;
  private currentTransactionId: number;
  private currentApiKeyId: number;
  private currentPaymentLinkId: number;
  private currentSubscriptionId: number;
  private currentIntegrationId: number;
  private currentMerchantIntegrationId: number;

  constructor() {
    this.users = new Map();
    this.merchants = new Map();
    this.transactions = new Map();
    this.apiKeys = new Map();
    this.paymentLinks = new Map();
    this.subscriptions = new Map();
    this.integrations = new Map();
    this.merchantIntegrations = new Map();
    
    this.currentUserId = 1;
    this.currentMerchantId = 1;
    this.currentTransactionId = 1;
    this.currentApiKeyId = 1;
    this.currentPaymentLinkId = 1;
    this.currentSubscriptionId = 1;
    this.currentIntegrationId = 1;
    this.currentMerchantIntegrationId = 1;
    
    // Initialize with some sample data for integrations
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    const sampleIntegrations: InsertIntegration[] = [
      {
        name: "Shopify",
        description: "Integrate payments directly with your Shopify store.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg",
        category: "ecommerce",
        isActive: true,
        config: {}
      },
      {
        name: "Salesforce",
        description: "Sync payment data with your CRM automatically.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg",
        category: "crm",
        isActive: true,
        config: {}
      },
      {
        name: "Slack",
        description: "Get real-time payment notifications in your channels.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
        category: "communication",
        isActive: true,
        config: {}
      },
      {
        name: "WooCommerce",
        description: "Process payments on your WordPress store.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        category: "ecommerce",
        isActive: true,
        config: {}
      },
      {
        name: "Google Analytics",
        description: "Track payment conversions and customer behavior.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
        category: "analytics",
        isActive: true,
        config: {}
      },
      {
        name: "Apple Pay",
        description: "Enable one-tap checkout for Apple device users.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
        category: "payment",
        isActive: true,
        config: {}
      },
      {
        name: "AWS",
        description: "Securely store payment data in S3 and more.",
        logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
        category: "cloud",
        isActive: true,
        config: {}
      }
    ];

    sampleIntegrations.forEach(integration => {
      this.createIntegration(integration);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Merchant operations
  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async getMerchantByUserId(userId: number): Promise<Merchant | undefined> {
    return Array.from(this.merchants.values()).find(
      (merchant) => merchant.userId === userId
    );
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const id = this.currentMerchantId++;
    const now = new Date();
    const merchant: Merchant = { ...insertMerchant, id, createdAt: now };
    this.merchants.set(id, merchant);
    return merchant;
  }

  async updateMerchant(id: number, merchantUpdate: Partial<InsertMerchant>): Promise<Merchant | undefined> {
    const merchant = this.merchants.get(id);
    if (!merchant) return undefined;
    
    const updatedMerchant = { ...merchant, ...merchantUpdate };
    this.merchants.set(id, updatedMerchant);
    return updatedMerchant;
  }

  async deleteMerchant(id: number): Promise<boolean> {
    return this.merchants.delete(id);
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByMerchantId(merchantId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.merchantId === merchantId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: now };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionUpdate: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // API Key operations
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    return this.apiKeys.get(id);
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      (apiKey) => apiKey.key === key
    );
  }

  async getApiKeysByMerchantId(merchantId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(
      (apiKey) => apiKey.merchantId === merchantId
    );
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = this.currentApiKeyId++;
    const now = new Date();
    const apiKey: ApiKey = { 
      ...insertApiKey, 
      id, 
      createdAt: now,
      lastUsed: null
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async updateApiKey(id: number, apiKeyUpdate: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const apiKey = this.apiKeys.get(id);
    if (!apiKey) return undefined;
    
    const updatedApiKey = { ...apiKey, ...apiKeyUpdate };
    this.apiKeys.set(id, updatedApiKey);
    return updatedApiKey;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    return this.apiKeys.delete(id);
  }

  // Payment Link operations
  async getPaymentLink(id: number): Promise<PaymentLink | undefined> {
    return this.paymentLinks.get(id);
  }

  async getPaymentLinksByMerchantId(merchantId: number): Promise<PaymentLink[]> {
    return Array.from(this.paymentLinks.values()).filter(
      (paymentLink) => paymentLink.merchantId === merchantId
    );
  }

  async createPaymentLink(insertPaymentLink: InsertPaymentLink): Promise<PaymentLink> {
    const id = this.currentPaymentLinkId++;
    const now = new Date();
    const paymentLink: PaymentLink = { ...insertPaymentLink, id, createdAt: now };
    this.paymentLinks.set(id, paymentLink);
    return paymentLink;
  }

  async updatePaymentLink(id: number, paymentLinkUpdate: Partial<InsertPaymentLink>): Promise<PaymentLink | undefined> {
    const paymentLink = this.paymentLinks.get(id);
    if (!paymentLink) return undefined;
    
    const updatedPaymentLink = { ...paymentLink, ...paymentLinkUpdate };
    this.paymentLinks.set(id, updatedPaymentLink);
    return updatedPaymentLink;
  }

  async deletePaymentLink(id: number): Promise<boolean> {
    return this.paymentLinks.delete(id);
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByMerchantId(merchantId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.merchantId === merchantId
    );
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionId++;
    const now = new Date();
    const subscription: Subscription = { ...insertSubscription, id, createdAt: now };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: number, subscriptionUpdate: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...subscriptionUpdate };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async deleteSubscription(id: number): Promise<boolean> {
    return this.subscriptions.delete(id);
  }

  // Integration operations
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getAllIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = this.currentIntegrationId++;
    const now = new Date();
    const integration: Integration = { ...insertIntegration, id, createdAt: now };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: number, integrationUpdate: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration = { ...integration, ...integrationUpdate };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  // Merchant Integration operations
  async getMerchantIntegration(id: number): Promise<MerchantIntegration | undefined> {
    return this.merchantIntegrations.get(id);
  }

  async getMerchantIntegrationsByMerchantId(merchantId: number): Promise<MerchantIntegration[]> {
    return Array.from(this.merchantIntegrations.values()).filter(
      (merchantIntegration) => merchantIntegration.merchantId === merchantId
    );
  }

  async createMerchantIntegration(insertMerchantIntegration: InsertMerchantIntegration): Promise<MerchantIntegration> {
    const id = this.currentMerchantIntegrationId++;
    const now = new Date();
    const merchantIntegration: MerchantIntegration = { ...insertMerchantIntegration, id, createdAt: now };
    this.merchantIntegrations.set(id, merchantIntegration);
    return merchantIntegration;
  }

  async updateMerchantIntegration(id: number, merchantIntegrationUpdate: Partial<InsertMerchantIntegration>): Promise<MerchantIntegration | undefined> {
    const merchantIntegration = this.merchantIntegrations.get(id);
    if (!merchantIntegration) return undefined;
    
    const updatedMerchantIntegration = { ...merchantIntegration, ...merchantIntegrationUpdate };
    this.merchantIntegrations.set(id, updatedMerchantIntegration);
    return updatedMerchantIntegration;
  }

  async deleteMerchantIntegration(id: number): Promise<boolean> {
    return this.merchantIntegrations.delete(id);
  }
}

// Import the DatabaseStorage class
import { DatabaseStorage } from "./database-storage";

// Use the DatabaseStorage implementation
export const storage = new DatabaseStorage();
