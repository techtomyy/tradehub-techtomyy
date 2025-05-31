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
import { eq, desc, and, or, ilike, gte, lte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

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
    let query = db
      .select()
      .from(listings)
      .where(eq(listings.status, 'active'));

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

    query = query.where(and(...conditions));

    if (filters?.featured) {
      query = query.orderBy(desc(listings.featured), desc(listings.createdAt));
    } else {
      query = query.orderBy(desc(listings.createdAt));
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
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
      .leftJoin(users, eq(listings.sellerId, users.id))
      .where(eq(listings.id, id));
    
    if (!result || !result.users) return undefined;
    
    return {
      ...result.listings,
      seller: result.users,
    };
  }

  async updateListing(id: string, updates: Partial<InsertListing>): Promise<Listing | undefined> {
    const [listing] = await db
      .update(listings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return listing;
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
      .leftJoin(users, eq(transactions.buyerId, users.id))
      .leftJoin(users, eq(transactions.sellerId, users.id))
      .leftJoin(listings, eq(transactions.listingId, listings.id))
      .where(eq(transactions.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.transactions,
      buyer: result.users!,
      seller: result.users!,
      listing: result.listings!,
    };
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return transaction;
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
      .orderBy(messages.createdAt);
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
    const user = await this.getUser(userId);
    
    const [salesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.sellerId, userId),
        eq(transactions.status, 'completed')
      ));

    const [purchasesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.buyerId, userId),
        eq(transactions.status, 'completed')
      ));

    const [activeListingsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(
        eq(listings.sellerId, userId),
        eq(listings.status, 'active')
      ));

    const [activeTransactionsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(
        or(
          eq(transactions.buyerId, userId),
          eq(transactions.sellerId, userId)
        )!,
        or(
          eq(transactions.status, 'initiated'),
          eq(transactions.status, 'payment_received'),
          eq(transactions.status, 'credentials_sent'),
          eq(transactions.status, 'verified')
        )!
      ));

    const [escrowBalance] = await db
      .select({ sum: sql<string>`COALESCE(SUM(total_amount), 0)` })
      .from(transactions)
      .where(and(
        eq(transactions.buyerId, userId),
        or(
          eq(transactions.status, 'payment_received'),
          eq(transactions.status, 'credentials_sent'),
          eq(transactions.status, 'verified')
        )!
      ));

    return {
      totalSales: salesCount.count,
      totalPurchases: purchasesCount.count,
      activeListings: activeListingsCount.count,
      activeTransactions: activeTransactionsCount.count,
      walletBalance: user?.walletBalance || '0.00',
      escrowBalance: escrowBalance.sum || '0.00',
    };
  }
}

export const storage = new DatabaseStorage();
