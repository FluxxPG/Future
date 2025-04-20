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
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

// Implementation of IStorage interface using a PostgreSQL database
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true; // Assuming success if no error is thrown
  }

  // Merchant operations
  async getMerchant(id: number): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, id));
    return merchant;
  }

  async getMerchantByUserId(userId: number): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.userId, userId));
    return merchant;
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return await db.select().from(merchants);
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const [merchant] = await db.insert(merchants).values(insertMerchant).returning();
    return merchant;
  }

  async updateMerchant(id: number, merchantUpdate: Partial<InsertMerchant>): Promise<Merchant | undefined> {
    const [updatedMerchant] = await db
      .update(merchants)
      .set(merchantUpdate)
      .where(eq(merchants.id, id))
      .returning();
    return updatedMerchant;
  }

  async deleteMerchant(id: number): Promise<boolean> {
    const result = await db.delete(merchants).where(eq(merchants.id, id));
    return true; // Assuming success if no error is thrown
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionsByMerchantId(merchantId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.merchantId, merchantId));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async updateTransaction(id: number, transactionUpdate: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set(transactionUpdate)
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  // API Key operations
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return apiKey;
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.key, key));
    return apiKey;
  }

  async getApiKeysByMerchantId(merchantId: number): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.merchantId, merchantId));
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db.insert(apiKeys).values(insertApiKey).returning();
    return apiKey;
  }

  async updateApiKey(id: number, apiKeyUpdate: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const [updatedApiKey] = await db
      .update(apiKeys)
      .set(apiKeyUpdate)
      .where(eq(apiKeys.id, id))
      .returning();
    return updatedApiKey;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    const result = await db.delete(apiKeys).where(eq(apiKeys.id, id));
    return true; // Assuming success if no error is thrown
  }

  // Payment Link operations
  async getPaymentLink(id: number): Promise<PaymentLink | undefined> {
    const [paymentLink] = await db.select().from(paymentLinks).where(eq(paymentLinks.id, id));
    return paymentLink;
  }

  async getPaymentLinksByMerchantId(merchantId: number): Promise<PaymentLink[]> {
    return await db.select().from(paymentLinks).where(eq(paymentLinks.merchantId, merchantId));
  }

  async createPaymentLink(insertPaymentLink: InsertPaymentLink): Promise<PaymentLink> {
    const [paymentLink] = await db.insert(paymentLinks).values(insertPaymentLink).returning();
    return paymentLink;
  }

  async updatePaymentLink(id: number, paymentLinkUpdate: Partial<InsertPaymentLink>): Promise<PaymentLink | undefined> {
    const [updatedPaymentLink] = await db
      .update(paymentLinks)
      .set(paymentLinkUpdate)
      .where(eq(paymentLinks.id, id))
      .returning();
    return updatedPaymentLink;
  }

  async deletePaymentLink(id: number): Promise<boolean> {
    const result = await db.delete(paymentLinks).where(eq(paymentLinks.id, id));
    return true; // Assuming success if no error is thrown
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async getSubscriptionsByMerchantId(merchantId: number): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.merchantId, merchantId));
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(insertSubscription).returning();
    return subscription;
  }

  async updateSubscription(id: number, subscriptionUpdate: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(subscriptionUpdate)
      .where(eq(subscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));
    return true; // Assuming success if no error is thrown
  }

  // Integration operations
  async getIntegration(id: number): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration;
  }

  async getAllIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const [integration] = await db.insert(integrations).values(insertIntegration).returning();
    return integration;
  }

  async updateIntegration(id: number, integrationUpdate: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const [updatedIntegration] = await db
      .update(integrations)
      .set(integrationUpdate)
      .where(eq(integrations.id, id))
      .returning();
    return updatedIntegration;
  }

  // Merchant Integration operations
  async getMerchantIntegration(id: number): Promise<MerchantIntegration | undefined> {
    const [merchantIntegration] = await db.select().from(merchantIntegrations).where(eq(merchantIntegrations.id, id));
    return merchantIntegration;
  }

  async getMerchantIntegrationsByMerchantId(merchantId: number): Promise<MerchantIntegration[]> {
    return await db.select().from(merchantIntegrations).where(eq(merchantIntegrations.merchantId, merchantId));
  }

  async createMerchantIntegration(insertMerchantIntegration: InsertMerchantIntegration): Promise<MerchantIntegration> {
    const [merchantIntegration] = await db.insert(merchantIntegrations).values(insertMerchantIntegration).returning();
    return merchantIntegration;
  }

  async updateMerchantIntegration(id: number, merchantIntegrationUpdate: Partial<InsertMerchantIntegration>): Promise<MerchantIntegration | undefined> {
    const [updatedMerchantIntegration] = await db
      .update(merchantIntegrations)
      .set(merchantIntegrationUpdate)
      .where(eq(merchantIntegrations.id, id))
      .returning();
    return updatedMerchantIntegration;
  }

  async deleteMerchantIntegration(id: number): Promise<boolean> {
    const result = await db.delete(merchantIntegrations).where(eq(merchantIntegrations.id, id));
    return true; // Assuming success if no error is thrown
  }
}