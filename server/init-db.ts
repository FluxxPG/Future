import { db } from "./db";
import { insertIntegrationSchema, integrations } from "@shared/schema";
import { z } from "zod";

/**
 * Initialize database with sample data
 */
export async function initializeDatabase() {
  try {
    console.log("Checking if database needs initialization...");
    
    // Check if integrations already exist
    const existingIntegrations = await db.select().from(integrations);
    
    if (existingIntegrations.length === 0) {
      console.log("No integrations found, initializing sample data...");
      
      // Sample integrations to initialize
      const sampleIntegrations = [
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
      
      // Validate and insert sample integrations
      for (const integration of sampleIntegrations) {
        const validatedIntegration = insertIntegrationSchema.parse(integration);
        await db.insert(integrations).values(validatedIntegration);
      }
      
      console.log("Database initialization complete");
    } else {
      console.log(`Database already contains ${existingIntegrations.length} integrations, skipping initialization`);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}