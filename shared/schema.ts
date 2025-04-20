import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("merchant").notNull(), // merchant, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  avatarUrl: text("avatar_url")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  avatarUrl: true
});

// Merchant schema
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  businessType: text("business_type"),
  websiteUrl: text("website_url"),
  kycStatus: text("kyc_status").default("pending").notNull(), // pending, approved, rejected
  kycData: jsonb("kyc_data"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertMerchantSchema = createInsertSchema(merchants).pick({
  userId: true,
  businessName: true,
  businessType: true,
  websiteUrl: true,
  kycStatus: true,
  kycData: true
});

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").default("USD").notNull(),
  status: text("status").notNull(), // succeeded, pending, failed
  paymentMethod: text("payment_method"),
  customerEmail: text("customer_email"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  merchantId: true,
  amount: true,
  currency: true,
  status: true,
  paymentMethod: true,
  customerEmail: true,
  metadata: true
});

// API Keys schema
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used")
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  merchantId: true,
  key: true,
  name: true,
  isActive: true
});

// Payment Links schema
export const paymentLinks = pgTable("payment_links", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  title: text("title").notNull(),
  description: text("description"),
  amount: integer("amount"), // in cents, optional for custom amount
  currency: text("currency").default("USD").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertPaymentLinkSchema = createInsertSchema(paymentLinks).pick({
  merchantId: true,
  title: true,
  description: true,
  amount: true,
  currency: true,
  isActive: true,
  expiresAt: true,
  metadata: true
});

// Subscriptions schema
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  name: text("name").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").default("USD").notNull(),
  interval: text("interval").notNull(), // day, week, month, year
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  merchantId: true,
  name: true,
  amount: true,
  currency: true,
  interval: true,
  isActive: true,
  metadata: true
});

// Integrations schema
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  category: text("category"), // crm, ecommerce, etc.
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  config: jsonb("config")
});

export const insertIntegrationSchema = createInsertSchema(integrations).pick({
  name: true,
  description: true,
  logoUrl: true,
  category: true,
  isActive: true,
  config: true
});

// Merchant Integrations schema
export const merchantIntegrations = pgTable("merchant_integrations", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => merchants.id),
  integrationId: integer("integration_id").notNull().references(() => integrations.id),
  isActive: boolean("is_active").default(true).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertMerchantIntegrationSchema = createInsertSchema(merchantIntegrations).pick({
  merchantId: true,
  integrationId: true,
  isActive: true,
  config: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type PaymentLink = typeof paymentLinks.$inferSelect;
export type InsertPaymentLink = z.infer<typeof insertPaymentLinkSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type MerchantIntegration = typeof merchantIntegrations.$inferSelect;
export type InsertMerchantIntegration = z.infer<typeof insertMerchantIntegrationSchema>;

// Define database relationships
// We'll implement relations properly when the DB integration is working
