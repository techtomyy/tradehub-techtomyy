import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  bio: text("bio"),
  kycVerified: boolean("kyc_verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalSales: integer("total_sales").default(0),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().notNull(),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // instagram, youtube, tiktok, twitter, website
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  followers: integer("followers"),
  engagement: decimal("engagement", { precision: 5, scale: 2 }),
  monthlyViews: integer("monthly_views"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }),
  media: jsonb("media"), // array of image URLs
  verificationStatus: varchar("verification_status", { length: 20 }).default("pending"), // pending, verified, rejected
  status: varchar("status", { length: 20 }).default("active"), // active, sold, expired, draft
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().notNull(),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  buyerFee: decimal("buyer_fee", { precision: 10, scale: 2 }).notNull(),
  sellerFee: decimal("seller_fee", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).default("initiated"), // initiated, payment_received, credentials_sent, verified, completed, disputed, cancelled
  escrowReleaseDate: timestamp("escrow_release_date"),
  verificationDeadline: timestamp("verification_deadline"),
  disputeReason: text("dispute_reason"),
  disputeResolution: text("dispute_resolution"),
  credentials: text("credentials"), // encrypted asset credentials
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().notNull(),
  transactionId: varchar("transaction_id").notNull().references(() => transactions.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments"), // array of file URLs
  isSystemMessage: boolean("is_system_message").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  buyerTransactions: many(transactions, { relationName: "buyer" }),
  sellerTransactions: many(transactions, { relationName: "seller" }),
  messages: many(messages),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  listing: one(listings, {
    fields: [transactions.listingId],
    references: [listings.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  transaction: one(transactions, {
    fields: [messages.transactionId],
    references: [transactions.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Validation schemas for API endpoints
export const createListingSchema = insertListingSchema.extend({
  media: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const createTransactionSchema = z.object({
  listingId: z.string(),
  amount: z.string(),
});

export const sendMessageSchema = z.object({
  transactionId: z.string(),
  content: z.string(),
  attachments: z.array(z.string()).optional(),
});
