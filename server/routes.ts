import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  createListingSchema,
  updateListingSchema,
  createTransactionSchema,
  sendMessageSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Listing routes
  app.get('/api/listings', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minFollowers: req.query.minFollowers ? Number(req.query.minFollowers) : undefined,
        maxFollowers: req.query.maxFollowers ? Number(req.query.maxFollowers) : undefined,
        verified: req.query.verified === 'true',
        search: req.query.search as string,
        featured: req.query.featured === 'true',
        limit: req.query.limit ? Number(req.query.limit) : 20,
        offset: req.query.offset ? Number(req.query.offset) : 0,
      };

      const listings = await storage.getListings(filters);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get('/api/listings/:id', async (req, res) => {
    try {
      const listing = await storage.getListingWithSeller(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post('/api/listings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = createListingSchema.parse(req.body);
      
      const listing = await storage.createListing({
        ...validatedData,
        sellerId: userId,
      });
      
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  app.put('/api/listings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listing = await storage.getListing(req.params.id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this listing" });
      }
      
      const validatedData = updateListingSchema.parse(req.body);
      const updatedListing = await storage.updateListing(req.params.id, validatedData);
      
      res.json(updatedListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  app.get('/api/users/:id/listings', async (req, res) => {
    try {
      const listings = await storage.getUserListings(req.params.id);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      res.status(500).json({ message: "Failed to fetch user listings" });
    }
  });

  // Transaction routes
  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = createTransactionSchema.parse(req.body);
      
      const listing = await storage.getListing(validatedData.listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.sellerId === userId) {
        return res.status(400).json({ message: "Cannot buy your own listing" });
      }
      
      const amount = parseFloat(validatedData.amount);
      const buyerFee = amount * 0.025; // 2.5%
      const sellerFee = amount * 0.025; // 2.5%
      const totalAmount = amount + buyerFee;
      
      const verificationDeadline = new Date();
      verificationDeadline.setHours(verificationDeadline.getHours() + 72); // 72 hours
      
      const transaction = await storage.createTransaction({
        buyerId: userId,
        sellerId: listing.sellerId,
        listingId: validatedData.listingId,
        amount: amount.toString(),
        buyerFee: buyerFee.toString(),
        sellerFee: sellerFee.toString(),
        totalAmount: totalAmount.toString(),
        status: 'payment_received',
        verificationDeadline,
      });
      
      // Create system message
      await storage.createMessage({
        transactionId: transaction.id,
        senderId: userId,
        content: "Transaction initiated. Payment has been placed in escrow.",
        isSystemMessage: true,
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transaction = await storage.getTransactionWithDetails(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to view this transaction" });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.put('/api/transactions/:id/verify', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transaction = await storage.getTransaction(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      if (transaction.buyerId !== userId) {
        return res.status(403).json({ message: "Only buyers can verify transactions" });
      }
      
      if (transaction.status !== 'credentials_sent') {
        return res.status(400).json({ message: "Transaction not ready for verification" });
      }
      
      const updatedTransaction = await storage.updateTransaction(req.params.id, {
        status: 'completed',
      });
      
      // Create system message
      await storage.createMessage({
        transactionId: req.params.id,
        senderId: userId,
        content: "Asset verified successfully. Funds have been released to seller.",
        isSystemMessage: true,
      });
      
      res.json(updatedTransaction);
    } catch (error) {
      console.error("Error verifying transaction:", error);
      res.status(500).json({ message: "Failed to verify transaction" });
    }
  });

  app.put('/api/transactions/:id/dispute', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { reason } = req.body;
      
      const transaction = await storage.getTransaction(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to dispute this transaction" });
      }
      
      const updatedTransaction = await storage.updateTransaction(req.params.id, {
        status: 'disputed',
        disputeReason: reason,
      });
      
      // Create system message
      await storage.createMessage({
        transactionId: req.params.id,
        senderId: userId,
        content: `Dispute opened by ${transaction.buyerId === userId ? 'buyer' : 'seller'}: ${reason}`,
        isSystemMessage: true,
      });
      
      res.json(updatedTransaction);
    } catch (error) {
      console.error("Error opening dispute:", error);
      res.status(500).json({ message: "Failed to open dispute" });
    }
  });

  app.get('/api/users/:id/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const targetUserId = req.params.id;
      
      if (userId !== targetUserId) {
        return res.status(403).json({ message: "Not authorized to view these transactions" });
      }
      
      const type = req.query.type as 'buyer' | 'seller' | undefined;
      const transactions = await storage.getUserTransactions(targetUserId, type);
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = sendMessageSchema.parse(req.body);
      
      const transaction = await storage.getTransaction(validatedData.transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to message in this transaction" });
      }
      
      const message = await storage.createMessage({
        transactionId: validatedData.transactionId,
        senderId: userId,
        content: validatedData.content,
        attachments: validatedData.attachments,
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/transactions/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transaction = await storage.getTransaction(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to view these messages" });
      }
      
      const messages = await storage.getTransactionMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Utility route for calculating fees
  app.post('/api/calculate-fees', async (req, res) => {
    try {
      const { amount } = req.body;
      const price = parseFloat(amount);
      
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const buyerFee = price * 0.025; // 2.5%
      const sellerFee = price * 0.025; // 2.5%
      const totalBuyerPays = price + buyerFee;
      const totalSellerReceives = price - sellerFee;
      
      res.json({
        assetPrice: price,
        buyerFee,
        sellerFee,
        totalBuyerPays,
        totalSellerReceives,
      });
    } catch (error) {
      console.error("Error calculating fees:", error);
      res.status(500).json({ message: "Failed to calculate fees" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
