import {
  users,
  listings,
  transactions,
  messages,
  type User,
  type UpsertUser,
  type Listing,
  type InsertListing,
  type Transaction,
  type InsertTransaction,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, or, ilike, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Listing operations
  createListing(listing: InsertListing): Promise<Listing>;
  getListings(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minFollowers?: number;
    maxFollowers?: number;
    verified?: boolean;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Listing[]>;
  getListing(id: string): Promise<Listing | undefined>;
  getListingWithSeller(id: string): Promise<(Listing & { seller: User }) | undefined>;
  updateListing(id: string, updates: Partial<InsertListing>): Promise<Listing | undefined>;
  getUserListings(userId: string): Promise<Listing[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionWithDetails(id: string): Promise<(Transaction & { buyer: User; seller: User; listing: Listing }) | undefined>;
  updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getUserTransactions(userId: string, type?: 'buyer' | 'seller'): Promise<Transaction[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getTransactionMessages(transactionId: string): Promise<Message[]>;
  
  // Dashboard operations
  getUserStats(userId: string): Promise<{
    totalSales: number;
    totalPurchases: number;
    activeListings: number;
    activeTransactions: number;
    walletBalance: string;
    escrowBalance: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Listing operations

  async createListing(listing: InsertListing): Promise<Listing> {
    const id = nanoid();
    const [newListing] = await db
      .insert(listings)
      .values({ ...listing, id })
      .returning();
    return newListing;
  }

  async getListings(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minFollowers?: number;
    maxFollowers?: number;
    verified?: boolean;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Listing[]> {
    const conditions = [eq(listings.status, 'active')];

    if (filters?.category) {
      conditions.push(eq(listings.category, filters.category));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(listings.price, filters.minPrice.toString()));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(listings.price, filters.maxPrice.toString()));
    }

    if (filters?.minFollowers !== undefined) {
      conditions.push(gte(listings.followers, filters.minFollowers));
    }

    if (filters?.maxFollowers !== undefined) {
      conditions.push(lte(listings.followers, filters.maxFollowers));
    }

    if (filters?.verified) {
      conditions.push(eq(listings.verificationStatus, 'verified'));
    }

    if (filters?.featured) {
      conditions.push(eq(listings.featured, true));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(listings.title, `%${filters.search}%`),
          ilike(listings.description, `%${filters.search}%`)
        )!
      );
    }

    const query = db
      .select()
      .from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt));

    if (filters?.limit && filters?.offset) {
      return await query.limit(filters.limit).offset(filters.offset);
    } else if (filters?.limit) {
      return await query.limit(filters.limit);
    } else if (filters?.offset) {
      return await query.offset(filters.offset);
    }

    return await query;
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id));
    return listing;
  }

  async getListingWithSeller(id: string): Promise<(Listing & { seller: User }) | undefined> {
    const [result] = await db
      .select()
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(eq(listings.id, id));

    if (!result) return undefined;

    return {
      ...result.listings,
      seller: result.users,
    };
  }

  async updateListing(id: string, updates: Partial<InsertListing>): Promise<Listing | undefined> {
    const [updatedListing] = await db
      .update(listings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return updatedListing;
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    return await db
      .select()
      .from(listings)
      .where(eq(listings.sellerId, userId))
      .orderBy(desc(listings.createdAt));
  }

  // Transaction operations

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = nanoid();
    const [newTransaction] = await db
      .insert(transactions)
      .values({ ...transaction, id })
      .returning();
    return newTransaction;
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionWithDetails(id: string): Promise<(Transaction & { buyer: User; seller: User; listing: Listing }) | undefined> {
    const [result] = await db
      .select()
      .from(transactions)
      .innerJoin(users, eq(transactions.buyerId, users.id))
      .innerJoin(users, eq(transactions.sellerId, users.id))
      .innerJoin(listings, eq(transactions.listingId, listings.id))
      .where(eq(transactions.id, id));

    if (!result) return undefined;

    return {
      ...result.transactions,
      buyer: result.users,
      seller: result.users,
      listing: result.listings,
    };
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  async getUserTransactions(userId: string, type?: 'buyer' | 'seller'): Promise<Transaction[]> {
    let query = db.select().from(transactions);
    
    if (type === 'buyer') {
      query = query.where(eq(transactions.buyerId, userId));
    } else if (type === 'seller') {
      query = query.where(eq(transactions.sellerId, userId));
    } else {
      query = query.where(
        or(
          eq(transactions.buyerId, userId),
          eq(transactions.sellerId, userId)
        )!
      );
    }

    return await query.orderBy(desc(transactions.createdAt));
  }

  // Message operations

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = nanoid();
    const [newMessage] = await db
      .insert(messages)
      .values({ ...message, id })
      .returning();
    return newMessage;
  }

  async getTransactionMessages(transactionId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.transactionId, transactionId))
      .orderBy(desc(messages.createdAt));
  }

  // Dashboard operations

  async getUserStats(userId: string): Promise<{
    totalSales: number;
    totalPurchases: number;
    activeListings: number;
    activeTransactions: number;
    walletBalance: string;
    escrowBalance: string;
  }> {
    const [userListings] = await db
      .select()
      .from(listings)
      .where(eq(listings.sellerId, userId));

    const [userTransactions] = await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.buyerId, userId),
          eq(transactions.sellerId, userId)
        )!
      );

    return {
      totalSales: 0,
      totalPurchases: 0,
      activeListings: 0,
      activeTransactions: 0,
      walletBalance: "0.00",
      escrowBalance: "0.00",
    };
  }
}

export const storage = new DatabaseStorage();