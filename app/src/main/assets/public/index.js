var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  airdropClaims: () => airdropClaims,
  airdropClaimsRelations: () => airdropClaimsRelations,
  cards: () => cards,
  completedTasks: () => completedTasks,
  completedTasksRelations: () => completedTasksRelations,
  faq: () => faq,
  insertAirdropClaimSchema: () => insertAirdropClaimSchema,
  insertCardSchema: () => insertCardSchema,
  insertCompletedTaskSchema: () => insertCompletedTaskSchema,
  insertFaqSchema: () => insertFaqSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertPageSchema: () => insertPageSchema,
  insertRoadmapItemSchema: () => insertRoadmapItemSchema,
  insertSystemSettingsSchema: () => insertSystemSettingsSchema,
  insertTaskCooldownSchema: () => insertTaskCooldownSchema,
  insertTaskSchema: () => insertTaskSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserSchema: () => insertUserSchema,
  news: () => news,
  pageRelations: () => pageRelations,
  pages: () => pages,
  passwordResetTokens: () => passwordResetTokens,
  roadmapItems: () => roadmapItems,
  systemSettings: () => systemSettings,
  taskCooldowns: () => taskCooldowns,
  taskCooldownsRelations: () => taskCooldownsRelations,
  taskRelations: () => taskRelations,
  tasks: () => tasks,
  transactions: () => transactions,
  transactionsRelations: () => transactionsRelations,
  userRelations: () => userRelations,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";
var passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at")
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  // Unique constraint veritabanında tanımlanmış olmalı
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 4 }).notNull().default("0"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  referralCode: text("referral_code"),
  referrerId: integer("referrer_id").references(() => users.id),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  birthDate: text("birth_date"),
  walletAddress: text("wallet_address"),
  kycStatus: text("kyc_status").default("pending"),
  kycSubmittedAt: timestamp("kyc_submitted_at"),
  lastAirdropClaim: timestamp("last_airdrop_claim"),
  profileImage: text("profile_image")
});
var airdropClaims = pgTable("airdrop_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
  type: text("type").notNull().default("daily")
  // 'daily', 'weekly', 'referral', vb.
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  type: text("type").notNull(),
  // 'airdrop', 'referral', 'bonus', vb.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: text("description")
});
var systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  dailyAirdropAmount: decimal("daily_airdrop_amount", { precision: 10, scale: 4 }).notNull().default("100.0000"),
  weeklyAirdropAmount: decimal("weekly_airdrop_amount", { precision: 10, scale: 4 }).notNull().default("500.0000"),
  referralBonusAmount: decimal("referral_bonus_amount", { precision: 10, scale: 4 }).notNull().default("50.0000"),
  referralBonusRate: decimal("referral_bonus_rate", { precision: 10, scale: 4 }).notNull().default("10.0000"),
  // Referans kazancı yüzde oranı (%)
  airdropCooldownHours: decimal("airdrop_cooldown_hours", { precision: 10, scale: 4 }).notNull().default("24"),
  // Saat cinsinden (ondalıklı değer kabul eder, örn: 0.0167 = 1 dakika)
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  websiteUrl: text("website_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content"),
  isPublished: boolean("is_published").notNull().default(false),
  showInMenu: boolean("show_in_menu").notNull().default(false),
  menuOrder: integer("menu_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pages.id),
  title: text("title").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
  adCode: text("ad_code"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  // 'ad', 'youtube', 'twitter', 'instagram', 'social_follow', etc.
  reward: decimal("reward", { precision: 10, scale: 4 }).notNull(),
  cooldownHours: decimal("cooldown_hours", { precision: 10, scale: 4 }).notNull().default("24"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // Google AdMob için ayarlar
  adMobUnitId: text("admob_unit_id"),
  // YouTube görevi için ayarlar
  youtubeVideoId: text("youtube_video_id"),
  youtubeVideoTitle: text("youtube_video_title"),
  youtubeRequiredWatchTimeSeconds: integer("youtube_required_watch_time_seconds"),
  youtubeAnswerKeywords: text("youtube_answer_keywords").array(),
  // Twitter/X görevi için ayarlar
  tweetUrl: text("tweet_url"),
  twitterUsername: text("twitter_username"),
  // Sosyal medya takip görevleri için ayarlar
  socialPlatform: text("social_platform"),
  // 'twitter', 'instagram', 'youtube', etc.
  socialProfileUrl: text("social_profile_url"),
  socialProfileUsername: text("social_profile_username"),
  // Tek seferlik görev mi?
  isOneTime: boolean("is_one_time").notNull().default(true)
});
var completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  earnedReward: decimal("earned_reward", { precision: 10, scale: 4 }).notNull(),
  // Gerekirse validation data veya proof saklayabiliriz
  validationData: jsonb("validation_data")
});
var taskCooldowns = pgTable("task_cooldowns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  taskId: integer("task_id").notNull().references(() => tasks.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  link: text("link"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var roadmapItems = pgTable("roadmap_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  // 1, 2, 3, 4 (çeyrekler)
  status: text("status").notNull().default("planned"),
  // 'planned', 'in_progress', 'completed'
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var faq = pgTable("faq", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("general"),
  isActive: boolean("is_active").notNull().default(true),
  language: text("language").notNull().default("tr"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
var userRelations = relations(users, ({ many, one }) => ({
  airdropClaims: many(airdropClaims),
  transactions: many(transactions),
  referrer: one(users),
  referrals: many(users),
  completedTasks: many(completedTasks),
  taskCooldowns: many(taskCooldowns)
}));
var airdropClaimsRelations = relations(airdropClaims, ({ one }) => ({
  user: one(users)
}));
var transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users)
}));
var pageRelations = relations(pages, ({ many }) => ({
  cards: many(cards)
}));
var taskRelations = relations(tasks, ({ many }) => ({
  completedTasks: many(completedTasks),
  cooldowns: many(taskCooldowns)
}));
var completedTasksRelations = relations(completedTasks, ({ one }) => ({
  user: one(users),
  task: one(tasks)
}));
var taskCooldownsRelations = relations(taskCooldowns, ({ one }) => ({
  user: one(users),
  task: one(tasks)
}));
var baseUserSchema = z.object({
  username: z.string().min(1, "Kullan\u0131c\u0131 ad\u0131 gerekli"),
  password: z.string().min(6, "\u015Eifre en az 6 karakter olmal\u0131")
});
var insertUserSchema = createInsertSchema(users).merge(baseUserSchema);
var insertAirdropClaimSchema = createInsertSchema(airdropClaims);
var insertTransactionSchema = createInsertSchema(transactions);
var insertSystemSettingsSchema = createInsertSchema(systemSettings);
var insertPageSchema = createInsertSchema(pages);
var insertCardSchema = createInsertSchema(cards);
var insertNewsSchema = createInsertSchema(news);
var insertTaskSchema = createInsertSchema(tasks);
var insertCompletedTaskSchema = createInsertSchema(completedTasks);
var insertTaskCooldownSchema = createInsertSchema(taskCooldowns);
var insertRoadmapItemSchema = createInsertSchema(roadmapItems);
var insertFaqSchema = createInsertSchema(faq);

// server/storage.ts
import session from "express-session";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// server/utils.ts
function log(message) {
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
}

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,
  // Maximum number of clients in the pool
  idleTimeoutMillis: 3e4,
  // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2e3
  // How long to wait before timing out when connecting a new client
};
var pool = new Pool(poolConfig);
pool.on("error", (err) => {
  log(`Unexpected error on idle database client: ${err.message}`);
  process.exit(-1);
});
var db = drizzle(pool, { schema: schema_exports });
async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    log("Database connection test successful");
    return true;
  } catch (error) {
    log(`Database connection test failed: ${error.message}`);
    return false;
  }
}
var checkDatabaseConnection = testConnection;

// server/storage.ts
import { eq, sql, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "session",
      createTableIfMissing: true
    });
  }
  // Görev fonksiyonları
  // Tüm görevleri getir
  async getAllTasks() {
    try {
      const result = await db.select().from(tasks).orderBy(tasks.order);
      return result;
    } catch (error) {
      log(`Error getting all tasks: ${error}`);
      throw error;
    }
  }
  // Kullanıcı için aktif görevleri getir
  async getActiveTasksForUser(userId) {
    try {
      const now = /* @__PURE__ */ new Date();
      const allTasks = await db.select().from(tasks).where(eq(tasks.isActive, true)).orderBy(tasks.order);
      const completedTasksArr = await db.select().from(completedTasks).where(eq(completedTasks.userId, userId));
      const activeCooldowns = await db.select().from(taskCooldowns).where(eq(taskCooldowns.userId, userId)).where(sql`${taskCooldowns.expiresAt} > now()`);
      return allTasks.map((task) => {
        const isOneTimeDone = task.isOneTime && completedTasksArr.some((ct) => ct.taskId === task.id);
        const cooldown = activeCooldowns.find((c) => c.taskId === task.id);
        const canClaim = !isOneTimeDone && !cooldown;
        return {
          ...task,
          isCompleted: isOneTimeDone,
          cooldownExpiresAt: cooldown?.expiresAt || null,
          canClaim
        };
      });
    } catch (error) {
      log(`Error getting active tasks for user ${userId}: ${error}`);
      throw error;
    }
  }
  // Belirli bir görevi ID ile getir
  async getTask(taskId) {
    try {
      const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting task ${taskId}: ${error}`);
      throw error;
    }
  }
  // Görevi tamamlandı olarak işaretle ve ödülü ver
  async completeTask(data) {
    try {
      const [completedTask] = await db.insert(completedTasks).values({
        userId: data.userId,
        taskId: data.taskId,
        earnedReward: data.earnedReward,
        validationData: data.validationData ? data.validationData : null
      }).returning();
      const user = await this.getUser(data.userId);
      if (user) {
        const newBalance = (Number(user.balance) + Number(data.earnedReward)).toString();
        await this.updateUserBalance(data.userId, newBalance);
        await db.insert(transactions).values({
          userId: data.userId,
          amount: data.earnedReward,
          type: "task_reward",
          description: "G\xF6rev tamamlama \xF6d\xFCl\xFC"
        });
      }
      return completedTask;
    } catch (error) {
      log(`Error completing task: ${error}`);
      throw error;
    }
  }
  // Kullanıcı belirli bir görevi tamamladı mı?
  async isTaskCompleted(userId, taskId) {
    try {
      const task = await this.getTask(taskId);
      if (task && !task.isOneTime) {
        return false;
      }
      const result = await db.select().from(completedTasks).where(eq(completedTasks.userId, userId)).where(eq(completedTasks.taskId, taskId)).limit(1);
      return result.length > 0;
    } catch (error) {
      log(`Error checking if task is completed: ${error}`);
      throw error;
    }
  }
  // Görev için bekleme süresi var mı?
  async checkTaskCooldown(userId, taskId) {
    try {
      const result = await db.select().from(taskCooldowns).where(eq(taskCooldowns.userId, userId)).where(eq(taskCooldowns.taskId, taskId)).where(sql`${taskCooldowns.expiresAt} > now()`).limit(1);
      return result[0] || null;
    } catch (error) {
      log(`Error checking task cooldown: ${error}`);
      throw error;
    }
  }
  // Görev için bekleme süresi oluştur
  async createTaskCooldown(data) {
    try {
      await db.delete(taskCooldowns).where(eq(taskCooldowns.userId, data.userId)).where(eq(taskCooldowns.taskId, data.taskId));
      const [cooldown] = await db.insert(taskCooldowns).values({
        userId: data.userId,
        taskId: data.taskId,
        expiresAt: data.expiresAt
      }).returning();
      return cooldown;
    } catch (error) {
      log(`Error creating task cooldown: ${error}`);
      throw error;
    }
  }
  // Eski task fonksiyonları (geriye dönük uyumluluk için)
  async getActiveQuizCooldown(userId, taskId) {
    return this.checkTaskCooldown(userId, taskId);
  }
  async createQuizCooldown(data) {
    return this.createTaskCooldown(data);
  }
  async createCompletedTask(userId, taskId) {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        throw new Error("G\xF6rev bulunamad\u0131");
      }
      return this.completeTask({
        userId,
        taskId,
        earnedReward: task.reward
      });
    } catch (error) {
      log(`Error in legacy createCompletedTask: ${error}`);
      throw error;
    }
  }
  async getUser(id) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting user ${id}: ${error}`);
      throw error;
    }
  }
  async getUserByUsername(username) {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting user by username ${username}: ${error}`);
      throw error;
    }
  }
  async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      log(`Error getting user by email ${email}: ${error}`);
      throw error;
    }
  }
  async createUser(insertUser) {
    try {
      log(`Creating user with data: username=${insertUser.username}, email=${insertUser.email}, referralCode=${insertUser.referralCode}, referrerId=${insertUser.referrerId}`);
      if (insertUser.email) {
        const existingUserWithEmail = await this.getUserByEmail(insertUser.email);
        if (existingUserWithEmail) {
          throw new Error("Bu e-posta adresi zaten kullan\u0131l\u0131yor");
        }
      }
      const result = await db.insert(users).values({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email,
        balance: "0",
        isAdmin: false,
        referralCode: insertUser.referralCode,
        referrerId: insertUser.referrerId
      }).returning();
      if (result && result.length > 0) {
        log(`User created successfully with referral code: ${result[0]?.referralCode}`);
        return result[0];
      }
      throw new Error("User creation failed - no result returned");
    } catch (error) {
      if (error.code === "23505") {
        if (error.detail?.includes("email")) {
          throw new Error("Bu e-posta adresi zaten kullan\u0131l\u0131yor");
        } else {
          throw new Error("Bu kullan\u0131c\u0131 ad\u0131 zaten kullan\u0131l\u0131yor");
        }
      }
      log(`Error creating user: ${error}`);
      throw error;
    }
  }
  async updateUserBalance(userId, newBalance) {
    const [user] = await db.update(users).set({ balance: newBalance }).where(eq(users.id, userId)).returning();
    return user;
  }
  async getTotalUsers() {
    const result = await db.select({ count: sql`count(*)` }).from(users);
    return result[0].count;
  }
  async getUserRank(userId) {
    const result = await db.select({ rank: sql`rank() over (order by ${users.balance} desc)` }).from(users).where(eq(users.id, userId));
    return result[0].rank;
  }
  async getTotalAirdropClaimed() {
    const result = await db.select({
      total: sql`COALESCE(
          SUM(${airdropClaims.amount}::decimal), 
          '0'
        )`
    }).from(airdropClaims);
    return Number(result[0].total);
  }
  async getUserStats() {
    const stats = await db.select({
      username: users.username,
      balance: users.balance,
      airdropClaimed: sql`COALESCE(
          (SELECT SUM(${airdropClaims.amount}::decimal)
           FROM ${airdropClaims}
           WHERE ${airdropClaims.userId} = ${users.id}),
          '0'
        )`
    }).from(users).orderBy(desc(users.balance));
    const rankedStats = stats.map((user, index) => ({
      username: user.username,
      balance: Number(user.balance),
      rank: index + 1,
      airdropClaimed: Number(user.airdropClaimed)
    }));
    return rankedStats;
  }
  async getUserReferrals(userId) {
    try {
      const referrals = await db.select({
        username: users.username,
        createdAt: users.createdAt,
        lastAirdropClaim: users.lastAirdropClaim,
        totalClaimed: sql`COALESCE(
            (SELECT SUM(${airdropClaims.amount}::decimal)
             FROM ${airdropClaims}
             WHERE ${airdropClaims.userId} = ${users.id}),
            '0'
          )`
      }).from(users).where(eq(users.referrerId, userId));
      return referrals.map((ref) => ({
        username: ref.username,
        createdAt: ref.createdAt,
        lastAirdropClaim: ref.lastAirdropClaim,
        totalClaimed: Number(ref.totalClaimed)
      }));
    } catch (error) {
      log(`Error getting referrals for user ${userId}: ${error}`);
      throw error;
    }
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { eq as eq3, and, sql as sql2 } from "drizzle-orm";
import helmet from "helmet";

// server/email.ts
import nodemailer from "nodemailer";
import { z as z2 } from "zod";
import { eq as eq2 } from "drizzle-orm";
var emailSettingsSchema = z2.object({
  host: z2.string().optional(),
  port: z2.number().or(z2.string().transform((val) => parseInt(val))).optional(),
  secure: z2.boolean().optional().default(true),
  user: z2.string(),
  password: z2.string(),
  from: z2.string()
});
function createEmailSettings() {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER
    };
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: true,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: process.env.EMAIL_FROM || process.env.SMTP_USER
    };
  }
  return {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user: process.env.GMAIL_USER || "gunbilisim@gmail.com",
    password: process.env.GMAIL_PASSWORD || "laed bovs tzlp bsio",
    from: process.env.EMAIL_FROM || "gunbilisim@gmail.com"
  };
}
async function sendEmail({
  to,
  subject,
  text: text2,
  html
}) {
  try {
    const settings = createEmailSettings();
    console.log(`E-posta g\xF6nderiliyor - Ayarlar:
      Host: ${settings.host}
      Port: ${settings.port}
      Secure: ${settings.secure}
      User: ${settings.user}
      From: ${settings.from}
      To: ${to}
      Subject: ${subject}
    `);
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.password
      }
    });
    const headers = {
      "X-Priority": "1",
      // Yüksek öncelik
      "X-MSMail-Priority": "High",
      "Importance": "High",
      "List-Unsubscribe": `<mailto:${settings.from}?subject=unsubscribe>`,
      "X-Mailer": "Goal Manager Platform",
      "X-Entity-Ref-ID": `goal-manager-${(/* @__PURE__ */ new Date()).getTime()}`,
      "Precedence": "bulk"
      // Grup mesajı olarak işaretle
    };
    const cleanSubject = subject.replace(/[!?$*]/g, "").trim();
    const info = await transporter.sendMail({
      from: {
        name: "Goal Manager",
        address: settings.from
      },
      to,
      subject: cleanSubject,
      text: text2,
      html: html || text2,
      headers,
      messageId: `<goal-manager-${(/* @__PURE__ */ new Date()).getTime()}@${settings.from.split("@")[1]}>`,
      priority: "high"
    });
    console.log(`E-posta g\xF6nderildi: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("E-posta g\xF6nderme hatas\u0131:", error);
    console.error("Hata detaylar\u0131:", JSON.stringify(error, null, 2));
    return false;
  }
}
async function sendPasswordResetEmail(email, resetToken) {
  const baseUrl = process.env.APP_URL || "https://e9d5664a-046f-41b3-86e5-925f2981b9b9-00-35qq8381ve45s.pike.replit.dev/";
  const resetLink = `${baseUrl}/auth?token=${resetToken}`;
  const subject = "\u015Eifre S\u0131f\u0131rlama Talebi";
  const text2 = `Merhaba,

Hesab\u0131n\u0131z i\xE7in \u015Fifre s\u0131f\u0131rlama talebinde bulundunuz.

\u015Eifrenizi s\u0131f\u0131rlamak i\xE7in a\u015Fa\u011F\u0131daki ba\u011Flant\u0131y\u0131 kullanabilirsiniz:
${resetLink}

Bu ba\u011Flant\u0131 24 saat boyunca ge\xE7erlidir.

Bu i\u015Flemi siz yapmad\u0131ysan\u0131z, l\xFCtfen bu e-postay\u0131 dikkate almay\u0131n\u0131z ve hesab\u0131n\u0131z\u0131n g\xFCvenli\u011Fi i\xE7in bizimle ileti\u015Fime ge\xE7iniz.

\u0130yi g\xFCnler dileriz,
Ekibimiz

-------------------------------------------
\xA9 2025 T\xFCm haklar\u0131 sakl\u0131d\u0131r.
-------------------------------------------`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>\u015Eifre S\u0131f\u0131rlama</title>
      <!--[if mso]>
      <style type="text/css">
        .fallback-font {
          font-family: Arial, sans-serif !important;
        }
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; -webkit-font-smoothing: antialiased; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #141D2F; padding: 20px 0;">
          <tr>
            <td align="center">
              <img src="https://resmim.net/cdn/2025/04/01/N0iDf1.png" alt="Logo" style="width: 180px; height: auto; margin-bottom: 10px;" />
              <p style="color: #ffffff; margin: 5px 0 0; font-size: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">Hesap G\xFCvenli\u011Fi</p>
            </td>
          </tr>
        </table>
        
        <!-- Content -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">Merhaba,</p>
              <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">Hesab\u0131n\u0131z i\xE7in <strong>\u015Fifre s\u0131f\u0131rlama talebinde</strong> bulundunuz.</p>
              <p style="margin: 0 0 30px; color: #333; font-size: 16px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">A\u015Fa\u011F\u0131daki butona t\u0131klayarak \u015Fifrenizi g\xFCvenli bir \u015Fekilde yenileyebilirsiniz:</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 20px 0 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 4px;" bgcolor="#E8C44C">
                          <a href="${resetLink}" target="_blank" style="font-size: 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #141D2F; text-decoration: none; padding: 12px 30px; border: 1px solid #E8C44C; display: inline-block; font-weight: bold; border-radius: 4px;" class="fallback-font">\u015E\u0130FREM\u0130 SIFIRLA</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; color: #333; font-size: 16px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">Ba\u011Flant\u0131 24 saat boyunca ge\xE7erlidir.</p>
              <p style="margin: 30px 0 0; padding-top: 15px; border-top: 1px solid #eee; color: #777; font-size: 14px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">Bu e-postay\u0131 siz talep etmediyseniz, l\xFCtfen dikkate almay\u0131n\u0131z ve hesab\u0131n\u0131z\u0131n g\xFCvenli\u011Fi i\xE7in <a href="#" style="color: #141D2F; text-decoration: underline;">bizimle ileti\u015Fime ge\xE7iniz</a>.</p>
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7;">
          <tr>
            <td align="center" style="padding: 30px 30px 20px;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">
                <a href="#" style="color: #141D2F; text-decoration: none; margin: 0 10px;">Yard\u0131m Merkezi</a> | 
                <a href="#" style="color: #141D2F; text-decoration: none; margin: 0 10px;">Gizlilik Politikas\u0131</a> | 
                <a href="#" style="color: #141D2F; text-decoration: none; margin: 0 10px;">\u0130leti\u015Fim</a>
              </p>
              <p style="margin: 20px 0 0; color: #999; font-size: 13px; line-height: 1.5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" class="fallback-font">
                \xA9 2025 T\xFCm haklar\u0131 sakl\u0131d\u0131r.
              </p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
  return await sendEmail({ to: email, subject, text: text2, html });
}

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  try {
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    const hashedPassword = buf.toString("hex");
    return `${hashedPassword}.${salt}`;
  } catch (error) {
    log(`Error hashing password: ${error}`);
    throw new Error("\u015Eifre olu\u015Fturulurken bir hata olu\u015Ftu");
  }
}
async function comparePasswords(supplied, stored) {
  try {
    const [hashedPassword, salt] = stored.split(".");
    if (!hashedPassword || !salt) {
      return false;
    }
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    const storedBuf = Buffer.from(hashedPassword, "hex");
    return timingSafeEqual(suppliedBuf, storedBuf);
  } catch (error) {
    log(`Password comparison error: ${error}`);
    return false;
  }
}
function generateReferralCode(username) {
  try {
    return username.toLowerCase();
  } catch (error) {
    log(`Error generating referral code: ${error}`);
    return randomBytes(4).toString("hex").toLowerCase();
  }
}
async function createPasswordResetToken(userId) {
  try {
    const token = randomBytes(32).toString("hex");
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt
    });
    return token;
  } catch (error) {
    log(`Error creating password reset token: ${error}`);
    throw new Error("\u015Eifre s\u0131f\u0131rlama kodu olu\u015Fturulurken hata olu\u015Ftu");
  }
}
async function requestPasswordReset(email, username) {
  try {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return { success: false, message: "Bu e-posta adresine sahip kullan\u0131c\u0131 bulunamad\u0131." };
    }
    if (user.username !== username) {
      return { success: false, message: "Kullan\u0131c\u0131 ad\u0131 ve e-posta adresi e\u015Fle\u015Fmiyor." };
    }
    const resetToken = await createPasswordResetToken(user.id);
    console.log(`\u015Eifre s\u0131f\u0131rlama e-postas\u0131 g\xF6nderiliyor: ${email}, token: ${resetToken.substring(0, 5)}...`);
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    console.log(`E-posta g\xF6nderim sonucu: ${emailSent ? "Ba\u015Far\u0131l\u0131" : "Ba\u015Far\u0131s\u0131z"}`);
    if (!emailSent) {
      return { success: false, message: "E-posta g\xF6nderilemedi. L\xFCtfen daha sonra tekrar deneyin." };
    }
    return { success: true, message: "\u015Eifre s\u0131f\u0131rlama ba\u011Flant\u0131s\u0131 e-posta adresinize g\xF6nderildi." };
  } catch (error) {
    log(`Password reset request error: ${error}`);
    return { success: false, message: "Bir hata olu\u015Ftu. L\xFCtfen daha sonra tekrar deneyin." };
  }
}
async function resetPasswordAndSendEmail(email, username) {
  try {
    console.log(`\u015Eifre s\u0131f\u0131rlama iste\u011Fi - E-posta: ${email}, Kullan\u0131c\u0131 ad\u0131: ${username}`);
    const user = await storage.getUserByEmail(email);
    if (!user) {
      console.log(`Kullan\u0131c\u0131 bulunamad\u0131 - E-posta: ${email}`);
      return { success: false, message: "Bu e-posta adresine sahip kullan\u0131c\u0131 bulunamad\u0131." };
    }
    if (user.username !== username) {
      console.log(`Kullan\u0131c\u0131 ad\u0131 e\u015Fle\u015Fmiyor - Gelen: ${username}, Kay\u0131tl\u0131: ${user.username}`);
      return { success: false, message: "Kullan\u0131c\u0131 ad\u0131 ve e-posta adresi e\u015Fle\u015Fmiyor." };
    }
    const token = await createPasswordResetToken(user.id);
    console.log(`ResetPasswordAndSendEmail - E-posta g\xF6nderiliyor: ${email}, token: ${token.substring(0, 5)}...`);
    const emailSent = await sendPasswordResetEmail(email, token);
    console.log(`ResetPasswordAndSendEmail - E-posta g\xF6nderim sonucu: ${emailSent ? "Ba\u015Far\u0131l\u0131" : "Ba\u015Far\u0131s\u0131z"}`);
    if (!emailSent) {
      return { success: false, message: "E-posta g\xF6nderilemedi. L\xFCtfen daha sonra tekrar deneyin." };
    }
    return { success: true, message: "\u015Eifre s\u0131f\u0131rlama ba\u011Flant\u0131s\u0131 e-posta adresinize g\xF6nderildi." };
  } catch (error) {
    log(`Password reset link email error: ${error}`);
    return { success: false, message: "Bir hata olu\u015Ftu. L\xFCtfen daha sonra tekrar deneyin." };
  }
}
async function resetPasswordWithToken(token, newPassword) {
  try {
    const resetToken = await db.select().from(passwordResetTokens).where(and(
      eq3(passwordResetTokens.token, token),
      sql2`${passwordResetTokens.usedAt} IS NULL`
    )).limit(1);
    if (resetToken.length === 0) {
      return { success: false, message: "Ge\xE7ersiz veya kullan\u0131lm\u0131\u015F token." };
    }
    const tokenData = resetToken[0];
    if (/* @__PURE__ */ new Date() > new Date(tokenData.expiresAt)) {
      return { success: false, message: "Token s\xFCresi dolmu\u015F." };
    }
    const hashedPassword = await hashPassword(newPassword);
    await db.update(users).set({ password: hashedPassword }).where(eq3(users.id, tokenData.userId));
    await db.update(passwordResetTokens).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq3(passwordResetTokens.id, tokenData.id));
    return { success: true, message: "\u015Eifreniz ba\u015Far\u0131yla de\u011Fi\u015Ftirildi." };
  } catch (error) {
    log(`Password reset with token error: ${error}`);
    return { success: false, message: "Bir hata olu\u015Ftu. L\xFCtfen daha sonra tekrar deneyin." };
  }
}
async function setupAdminUser() {
  try {
    const adminUsername = "kocero63";
    const adminPassword = "Kocero63";
    const adminEmail = "gunbilisim@gmail.com";
    let adminUser = await db.select().from(users).where(eq3(users.username, adminUsername)).limit(1);
    if (!adminUser.length) {
      const hashedPassword = await hashPassword(adminPassword);
      await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        isAdmin: true,
        createdAt: /* @__PURE__ */ new Date(),
        lastMiningUpdate: /* @__PURE__ */ new Date()
      });
      log("Admin user created successfully");
    } else {
      const hashedPassword = await hashPassword(adminPassword);
      await db.update(users).set({
        password: hashedPassword,
        email: adminEmail
      }).where(eq3(users.username, adminUsername));
      log("Admin password and email updated successfully");
    }
  } catch (error) {
    log(`Error setting up admin user: ${error}`);
    throw error;
  }
}
function setupAuth(app2) {
  app2.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    }
  }));
  const sessionSettings = {
    secret: "goal-manager-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false,
      // Geliştirme ortamında false olmalı
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 gün
      sameSite: "lax"
    },
    name: "gm_sid"
    // Default 'connect.sid' yerine özel session ismi
  };
  if (process.env.NODE_ENV === "production") {
    app2.set("trust proxy", 1);
    sessionSettings.cookie.secure = true;
  }
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  const loginAttempts = /* @__PURE__ */ new Map();
  passport.use(
    new LocalStrategy({
      usernameField: "email",
      // E-posta alanını kullanacağımızı belirtiyoruz
      passwordField: "password"
    }, async (email, password, done) => {
      try {
        const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
        const now = Date.now();
        if (attempts.count >= 5 && now - attempts.lastAttempt < 15 * 60 * 1e3) {
          return done(null, false, { message: "\xC7ok fazla ba\u015Far\u0131s\u0131z deneme. L\xFCtfen 15 dakika bekleyin." });
        }
        const user = await storage.getUserByEmail(email);
        if (!user) {
          loginAttempts.set(email, {
            count: attempts.count + 1,
            lastAttempt: now
          });
          return done(null, false, { message: "E-posta adresi veya \u015Fifre hatal\u0131" });
        }
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          loginAttempts.set(email, {
            count: attempts.count + 1,
            lastAttempt: now
          });
          return done(null, false, { message: "E-posta adresi veya \u015Fifre hatal\u0131" });
        }
        loginAttempts.delete(email);
        return done(null, user);
      } catch (error) {
        log(`Authentication error: ${error}`);
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, confirmPassword, referralCode: inputReferralCode } = req.body;
      if (!username || !password || !email || !confirmPassword) {
        return res.status(400).json({ message: "Kullan\u0131c\u0131 ad\u0131, e-posta, \u015Fifre ve \u015Fifre tekrar\u0131 gerekli" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "\u015Eifreler e\u015Fle\u015Fmiyor" });
      }
      if (username.length < 4 || username.length > 8) {
        return res.status(400).json({ message: "Kullan\u0131c\u0131 ad\u0131 4-8 karakter uzunlu\u011Funda olmal\u0131d\u0131r" });
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "\u015Eifre en az 6 karakter uzunlu\u011Funda olmal\u0131 ve en az bir harf ve bir rakam i\xE7ermelidir" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Ge\xE7erli bir e-posta adresi giriniz" });
      }
      const lowerUsername = username.toLowerCase();
      const existingUsers = await db.select().from(users);
      const existingUsernameCaseInsensitive = existingUsers.find(
        (u) => u.username.toLowerCase() === lowerUsername
      );
      if (existingUsernameCaseInsensitive) {
        return res.status(400).json({ message: "Bu kullan\u0131c\u0131 ad\u0131 zaten kullan\u0131l\u0131yor" });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullan\u0131l\u0131yor" });
      }
      const hashedPassword = await hashPassword(password);
      const newReferralCode = generateReferralCode(username);
      log(`Generated referral code ${newReferralCode} for user ${username}`);
      let referrerId = null;
      if (inputReferralCode) {
        const referrer = await db.select().from(users).where(eq3(users.referralCode, inputReferralCode)).limit(1);
        if (referrer.length > 0) {
          referrerId = referrer[0].id;
          log(`Found referrer with ID ${referrerId} for referral code ${inputReferralCode}`);
        } else {
          log(`No referrer found for referral code ${inputReferralCode}`);
        }
      }
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        referralCode: newReferralCode,
        referrerId
      });
      log(`Created user with referral code ${user.referralCode}`);
      req.login(user, (err) => {
        if (err) {
          log(`Login error after registration: ${err}`);
          return res.status(500).json({ message: "Giri\u015F yap\u0131l\u0131rken bir hata olu\u015Ftu" });
        }
        res.json(user);
      });
    } catch (error) {
      log(`Registration error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
      res.status(400).json({ message: errorMessage });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "E-posta adresi veya \u015Fifre hatal\u0131" });
      }
      req.login(user, (err2) => {
        if (err2) {
          return next(err2);
        }
        res.json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "\xC7\u0131k\u0131\u015F yap\u0131l\u0131rken bir hata olu\u015Ftu" });
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}

// server/middleware/auth.ts
function isAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin yetkisi gerekli" });
  }
  next();
}

// server/routes.ts
import { z as z5 } from "zod";
import { eq as eq8, sql as sql3, desc as desc3, asc } from "drizzle-orm";

// server/mining.ts
import { eq as eq4, and as and2, gte } from "drizzle-orm";
async function claimDailyMining(userId) {
  try {
    const [user] = await db.select().from(users).where(eq4(users.id, userId));
    if (!user) {
      return {
        success: false,
        amount: "0",
        message: "Kullan\u0131c\u0131 bulunamad\u0131"
      };
    }
    const [settings] = await db.select().from(systemSettings).limit(1);
    if (!settings) {
      return {
        success: false,
        amount: "0",
        message: "Sistem ayarlar\u0131 bulunamad\u0131"
      };
    }
    const cooldownHours = parseFloat(settings.airdropCooldownHours);
    const additionalHours = Math.floor(cooldownHours);
    const additionalMinutes = Math.round((cooldownHours - additionalHours) * 60);
    log(`Madencilik bekleme s\xFCresi: ${cooldownHours} saat (${cooldownHours * 60} dakika)`);
    let cooldownDate = /* @__PURE__ */ new Date();
    cooldownDate.setHours(cooldownDate.getHours() - additionalHours);
    cooldownDate.setMinutes(cooldownDate.getMinutes() - additionalMinutes);
    log(`Kontrol s\xFCresi ba\u015Flang\u0131c\u0131: ${cooldownDate.toISOString()}`);
    if (user.lastAirdropClaim && new Date(user.lastAirdropClaim) > cooldownDate) {
      const nextClaimTime = new Date(user.lastAirdropClaim);
      const currentHours = nextClaimTime.getHours();
      const currentMinutes = nextClaimTime.getMinutes();
      nextClaimTime.setHours(currentHours + additionalHours);
      nextClaimTime.setMinutes(currentMinutes + additionalMinutes);
      const remainingMinutes = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1e3 * 60));
      log(`Bir sonraki madencilik \xF6d\xFCl\xFC i\xE7in kalan dakika: ${remainingMinutes}`);
      return {
        success: false,
        amount: "0",
        message: `${remainingMinutes} dakika sonra tekrar madencilik \xF6d\xFCl\xFC talep edebilirsiniz.`
      };
    }
    log("Madencilik \xF6d\xFCl\xFC talep edilebilir - bekleme s\xFCresi ge\xE7mi\u015F");
    const miningAmount = settings.dailyAirdropAmount;
    const newBalance = (parseFloat(user.balance) + parseFloat(miningAmount)).toFixed(2);
    log(`Madencilik i\u015Flemi ba\u015Flat\u0131ld\u0131 - Kullan\u0131c\u0131: ${userId}, Miktar: ${miningAmount}`);
    await db.transaction(async (tx) => {
      await tx.update(users).set({
        balance: newBalance,
        lastAirdropClaim: /* @__PURE__ */ new Date()
        // Yeni bir döngü başlatmak için claim zamanını güncelle
      }).where(eq4(users.id, userId));
      await tx.insert(airdropClaims).values({
        userId,
        amount: miningAmount,
        claimedAt: /* @__PURE__ */ new Date(),
        type: "daily"
      });
      await tx.insert(transactions).values({
        userId,
        amount: miningAmount,
        type: "mining",
        description: "G\xFCnl\xFCk Madencilik"
      });
      if (user.referrerId) {
        const [referrer] = await tx.select().from(users).where(eq4(users.id, user.referrerId));
        if (referrer) {
          const referralBonusRate = parseFloat(settings.referralBonusRate) / 100;
          const bonusAmount = (parseFloat(miningAmount) * referralBonusRate).toFixed(4);
          const referrerNewBalance = (parseFloat(referrer.balance) + parseFloat(bonusAmount)).toFixed(4);
          await tx.update(users).set({ balance: referrerNewBalance }).where(eq4(users.id, referrer.id));
          await tx.insert(transactions).values({
            userId: referrer.id,
            amount: bonusAmount,
            type: "referral",
            description: `Referans Bonusu - ${user.username}`
          });
          log(`Referans bonusu eklendi - Referans: ${referrer.id}, Kullan\u0131c\u0131: ${user.username}, Miktar: ${bonusAmount}`);
        }
      }
    });
    log(`Madencilik tamamland\u0131 - Kullan\u0131c\u0131: ${userId}, Miktar: ${miningAmount}, Yeni Bakiye: ${newBalance}`);
    const formattedAmount = parseFloat(miningAmount).toFixed(2);
    return {
      success: true,
      amount: miningAmount,
      message: `${formattedAmount} GM Coin ba\u015Far\u0131yla hesab\u0131n\u0131za eklendi!`
    };
  } catch (error) {
    log(`Madencilik hatas\u0131: ${error}`);
    return {
      success: false,
      amount: "0",
      message: "\u0130\u015Flem s\u0131ras\u0131nda bir hata olu\u015Ftu"
    };
  }
}
async function getMiningStatus(userId) {
  try {
    const [user] = await db.select().from(users).where(eq4(users.id, userId));
    if (!user) {
      throw new Error("Kullan\u0131c\u0131 bulunamad\u0131");
    }
    const [settings] = await db.select().from(systemSettings).limit(1);
    if (!settings) {
      throw new Error("Sistem ayarlar\u0131 bulunamad\u0131");
    }
    const cooldownHours = parseFloat(settings.airdropCooldownHours);
    log(`Madencilik bekleme s\xFCresi: ${cooldownHours} saat (${cooldownHours * 60} dakika)`);
    let nextClaimTime = null;
    let canClaim = true;
    if (user.lastAirdropClaim) {
      log(`Son madencilik \xF6d\xFCl\xFC al\u0131nma tarihi: ${user.lastAirdropClaim}`);
      nextClaimTime = new Date(user.lastAirdropClaim);
      const additionalHours = Math.floor(cooldownHours);
      const additionalMinutes = Math.round((cooldownHours - additionalHours) * 60);
      nextClaimTime.setHours(nextClaimTime.getHours() + additionalHours);
      nextClaimTime.setMinutes(nextClaimTime.getMinutes() + additionalMinutes);
      log(`Bir sonraki madencilik tarihi: ${nextClaimTime.toISOString()}`);
      log(`\u015Eu anki tarih: ${(/* @__PURE__ */ new Date()).toISOString()}`);
      canClaim = nextClaimTime <= /* @__PURE__ */ new Date();
      log(`Madencilik \xF6d\xFCl\xFC talep edilebilir mi: ${canClaim}`);
      if (!canClaim) {
        const remainingMinutes = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1e3 * 60));
        log(`Bir sonraki madencilik i\xE7in kalan dakika: ${remainingMinutes}`);
      }
    }
    return {
      canClaim,
      nextClaimTime: nextClaimTime ? nextClaimTime.toISOString() : null,
      dailyAmount: settings.dailyAirdropAmount,
      weeklyAmount: settings.weeklyAirdropAmount,
      lastClaimTime: user.lastAirdropClaim ? new Date(user.lastAirdropClaim).toISOString() : null
    };
  } catch (error) {
    log(`Madencilik durumu hatas\u0131: ${error}`);
    throw error;
  }
}
async function getMiningHistory(userId) {
  try {
    const history = await db.select().from(airdropClaims).where(eq4(airdropClaims.userId, userId)).orderBy(airdropClaims.claimedAt);
    return history;
  } catch (error) {
    log(`Madencilik ge\xE7mi\u015Fi hatas\u0131: ${error}`);
    throw error;
  }
}
async function startNewMiningCycle(userId) {
  try {
    const [user] = await db.select().from(users).where(eq4(users.id, userId));
    if (!user) {
      return {
        success: false,
        amount: "0",
        message: "Kullan\u0131c\u0131 bulunamad\u0131"
      };
    }
    const [settings] = await db.select().from(systemSettings).limit(1);
    if (!settings) {
      log(`Sistem ayarlar\u0131 al\u0131n\u0131rken hata`);
      return {
        success: false,
        amount: "0",
        message: "Sistem ayarlar\u0131 bulunamad\u0131"
      };
    }
    const initialRewardAmount = "25.0000";
    const cooldownHours = parseFloat(settings.airdropCooldownHours);
    log(`\u0130lk madencilik d\xF6ng\xFCs\xFC \xF6d\xFCl\xFC: ${initialRewardAmount} GM Coin`);
    log(`Yeni madencilik d\xF6ng\xFCs\xFC ba\u015Flat\u0131l\u0131yor - Kullan\u0131c\u0131: ${userId}`);
    const newBalance = (parseFloat(user.balance) + parseFloat(initialRewardAmount)).toFixed(4);
    await db.transaction(async (tx) => {
      await tx.update(users).set({
        balance: newBalance,
        lastAirdropClaim: /* @__PURE__ */ new Date()
        // Yeni bir döngü başlatmak için claim zamanını güncelle
      }).where(eq4(users.id, userId));
      await tx.insert(airdropClaims).values({
        userId,
        amount: initialRewardAmount,
        claimedAt: /* @__PURE__ */ new Date(),
        type: "cycle"
      });
      await tx.insert(transactions).values({
        userId,
        amount: initialRewardAmount,
        type: "mining",
        description: "\u0130lk Madencilik D\xF6ng\xFCs\xFC"
      });
    });
    log(`\u0130lk d\xF6ng\xFC ba\u015Flat\u0131ld\u0131 - Kullan\u0131c\u0131: ${userId}, Miktar: ${initialRewardAmount}`);
    return {
      success: true,
      amount: initialRewardAmount,
      message: `\u0130lk madencilik d\xF6ng\xFCn\xFCz ba\u015Flat\u0131ld\u0131 ve ${initialRewardAmount} GM Coin hesab\u0131n\u0131za eklendi!`
    };
  } catch (error) {
    log(`D\xF6ng\xFC ba\u015Flatma hatas\u0131: ${error}`);
    return {
      success: false,
      amount: "0",
      message: "\u0130\u015Flem s\u0131ras\u0131nda bir hata olu\u015Ftu"
    };
  }
}
function handleClaimMining(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
  }
  claimDailyMining(userId).then((result) => {
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  }).catch((err) => {
    log(`Madencilik API hatas\u0131: ${err}`);
    res.status(500).json({
      success: false,
      amount: "0",
      message: "Sistem hatas\u0131"
    });
  });
}
function handleGetMiningStatus(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
  }
  getMiningStatus(userId).then((status) => {
    res.json(status);
  }).catch((err) => {
    log(`Madencilik durumu API hatas\u0131: ${err}`);
    res.status(500).json({ error: "Madencilik durumu al\u0131namad\u0131" });
  });
}
function handleGetMiningHistory(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
  }
  getMiningHistory(userId).then((history) => {
    res.json(history);
  }).catch((err) => {
    log(`Madencilik ge\xE7mi\u015Fi API hatas\u0131: ${err}`);
    res.status(500).json({ error: "Madencilik ge\xE7mi\u015Fi al\u0131namad\u0131" });
  });
}
function handleStartNewCycle(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
  }
  startNewMiningCycle(userId).then((result) => {
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  }).catch((err) => {
    log(`D\xF6ng\xFC ba\u015Flatma API hatas\u0131: ${err}`);
    res.status(500).json({
      success: false,
      amount: "0",
      message: "Sistem hatas\u0131"
    });
  });
}
async function claimAdMobReward(userId) {
  try {
    const [user] = await db.select().from(users).where(eq4(users.id, userId));
    if (!user) {
      return {
        success: false,
        amount: "0",
        message: "Kullan\u0131c\u0131 bulunamad\u0131"
      };
    }
    const cooldownHours = 4;
    let cooldownDate = /* @__PURE__ */ new Date();
    cooldownDate.setHours(cooldownDate.getHours() - cooldownHours);
    const recentAdMobClaims = await db.select().from(airdropClaims).where(
      and2(
        eq4(airdropClaims.userId, userId),
        eq4(airdropClaims.type, "admob"),
        gte(airdropClaims.claimedAt, cooldownDate)
      )
    );
    if (recentAdMobClaims.length > 0) {
      const lastClaimTime = new Date(recentAdMobClaims[0].claimedAt);
      const nextClaimTime = new Date(lastClaimTime);
      nextClaimTime.setHours(nextClaimTime.getHours() + cooldownHours);
      const remainingMinutes = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1e3 * 60));
      return {
        success: false,
        amount: "0",
        message: `${remainingMinutes} dakika sonra tekrar AdMob \xF6d\xFCl\xFC talep edebilirsiniz.`
      };
    }
    const rewardAmount = "5.0000";
    const newBalance = (parseFloat(user.balance) + parseFloat(rewardAmount)).toFixed(4);
    log(`AdMob \xF6d\xFCl\xFC i\u015Flemi ba\u015Flat\u0131ld\u0131 - Kullan\u0131c\u0131: ${userId}, Miktar: ${rewardAmount}`);
    await db.transaction(async (tx) => {
      await tx.update(users).set({
        balance: newBalance
      }).where(eq4(users.id, userId));
      await tx.insert(airdropClaims).values({
        userId,
        amount: rewardAmount,
        claimedAt: /* @__PURE__ */ new Date(),
        type: "admob"
      });
      await tx.insert(transactions).values({
        userId,
        amount: rewardAmount,
        type: "admob",
        description: "AdMob Reklam \xD6d\xFCl\xFC"
      });
    });
    log(`AdMob \xF6d\xFCl\xFC tamamland\u0131 - Kullan\u0131c\u0131: ${userId}, Miktar: ${rewardAmount}, Yeni Bakiye: ${newBalance}`);
    return {
      success: true,
      amount: rewardAmount,
      message: `Reklam izledi\u011Finiz i\xE7in 5 GM Coin hesab\u0131n\u0131za eklendi!`
    };
  } catch (error) {
    log(`AdMob \xF6d\xFCl\xFC hatas\u0131: ${error}`);
    return {
      success: false,
      amount: "0",
      message: "\u0130\u015Flem s\u0131ras\u0131nda bir hata olu\u015Ftu"
    };
  }
}
function handleClaimAdMobReward(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
  }
  claimAdMobReward(userId).then((result) => {
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  }).catch((err) => {
    log(`AdMob \xF6d\xFCl\xFC API hatas\u0131: ${err}`);
    res.status(500).json({
      success: false,
      amount: "0",
      message: "Sistem hatas\u0131"
    });
  });
}

// server/tasks.ts
import { z as z3 } from "zod";
import { addHours } from "date-fns";
import { eq as eq5 } from "drizzle-orm";
var taskSchema = z3.object({
  title: z3.string().min(3, "Ba\u015Fl\u0131k en az 3 karakter olmal\u0131"),
  description: z3.string().min(10, "A\xE7\u0131klama en az 10 karakter olmal\u0131"),
  type: z3.string(),
  // 'ad', 'youtube', 'twitter', 'social_follow', etc.
  reward: z3.string().or(z3.number()).transform((val) => typeof val === "string" ? parseFloat(val) : val),
  cooldownHours: z3.string().or(z3.number()).transform((val) => typeof val === "string" ? parseFloat(val) : val),
  isActive: z3.boolean().default(true),
  isOneTime: z3.boolean().default(false),
  order: z3.number().optional().default(0),
  // Google AdMob için
  adMobUnitId: z3.string().optional(),
  // YouTube için
  youtubeVideoId: z3.string().optional(),
  youtubeVideoTitle: z3.string().optional(),
  youtubeRequiredWatchTimeSeconds: z3.number().optional(),
  youtubeAnswerKeywords: z3.array(z3.string()).optional(),
  // Twitter/X için
  tweetUrl: z3.string().optional(),
  twitterUsername: z3.string().optional(),
  // Sosyal medya takip için
  socialPlatform: z3.string().optional(),
  socialProfileUrl: z3.string().optional(),
  socialProfileUsername: z3.string().optional()
});
var completeTaskSchema = z3.object({
  taskId: z3.number(),
  validationData: z3.any().optional()
});
async function handleAdminGetAllTasks(req, res) {
  try {
    if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Bu i\u015Flem i\xE7in yetkiniz yok" });
    }
    const allTasks = await db.select().from(tasks).orderBy(tasks.order);
    res.json(allTasks);
  } catch (error) {
    log(`Error getting all tasks for admin: ${error}`);
    res.status(500).json({ error: "G\xF6revler getirilirken bir hata olu\u015Ftu" });
  }
}
async function handleCreateTask(req, res) {
  try {
    if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Bu i\u015Flem i\xE7in yetkiniz yok" });
    }
    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Ge\xE7ersiz g\xF6rev verisi",
        details: validation.error.format()
      });
    }
    const taskData = validation.data;
    let specialFields = {};
    switch (taskData.type) {
      case "ad":
        specialFields = {
          adMobUnitId: taskData.adMobUnitId
        };
        break;
      case "youtube":
        specialFields = {
          youtubeVideoId: taskData.youtubeVideoId,
          youtubeVideoTitle: taskData.youtubeVideoTitle,
          youtubeRequiredWatchTimeSeconds: taskData.youtubeRequiredWatchTimeSeconds,
          youtubeAnswerKeywords: taskData.youtubeAnswerKeywords
        };
        break;
      case "twitter":
        specialFields = {
          tweetUrl: taskData.tweetUrl,
          twitterUsername: taskData.twitterUsername
        };
        break;
      case "social_follow":
        specialFields = {
          socialPlatform: taskData.socialPlatform,
          socialProfileUrl: taskData.socialProfileUrl,
          socialProfileUsername: taskData.socialProfileUsername
        };
        break;
    }
    const newTask = await db.insert(tasks).values({
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      reward: taskData.reward.toString(),
      cooldownHours: taskData.cooldownHours.toString(),
      isActive: taskData.isActive,
      isOneTime: taskData.isOneTime,
      order: taskData.order || 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      ...specialFields
    }).returning();
    res.status(201).json(newTask[0]);
  } catch (error) {
    log(`Error creating task: ${error}`);
    res.status(500).json({ error: "G\xF6rev olu\u015Fturulurken bir hata olu\u015Ftu" });
  }
}
async function handleUpdateTask(req, res) {
  try {
    if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Bu i\u015Flem i\xE7in yetkiniz yok" });
    }
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Ge\xE7ersiz g\xF6rev ID" });
    }
    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Ge\xE7ersiz g\xF6rev verisi",
        details: validation.error.format()
      });
    }
    const taskData = validation.data;
    let specialFields = {};
    switch (taskData.type) {
      case "ad":
        specialFields = {
          adMobUnitId: taskData.adMobUnitId,
          // Diğer görev tipleri için alanları temizle
          youtubeVideoId: null,
          youtubeVideoTitle: null,
          youtubeRequiredWatchTimeSeconds: null,
          youtubeAnswerKeywords: null,
          tweetUrl: null,
          twitterUsername: null,
          socialPlatform: null,
          socialProfileUrl: null,
          socialProfileUsername: null
        };
        break;
      case "youtube":
        specialFields = {
          youtubeVideoId: taskData.youtubeVideoId,
          youtubeVideoTitle: taskData.youtubeVideoTitle,
          youtubeRequiredWatchTimeSeconds: taskData.youtubeRequiredWatchTimeSeconds,
          youtubeAnswerKeywords: taskData.youtubeAnswerKeywords,
          // Diğer görev tipleri için alanları temizle
          adMobUnitId: null,
          tweetUrl: null,
          twitterUsername: null,
          socialPlatform: null,
          socialProfileUrl: null,
          socialProfileUsername: null
        };
        break;
      case "twitter":
        specialFields = {
          tweetUrl: taskData.tweetUrl,
          twitterUsername: taskData.twitterUsername,
          // Diğer görev tipleri için alanları temizle
          adMobUnitId: null,
          youtubeVideoId: null,
          youtubeVideoTitle: null,
          youtubeRequiredWatchTimeSeconds: null,
          youtubeAnswerKeywords: null,
          socialPlatform: null,
          socialProfileUrl: null,
          socialProfileUsername: null
        };
        break;
      case "social_follow":
        specialFields = {
          socialPlatform: taskData.socialPlatform,
          socialProfileUrl: taskData.socialProfileUrl,
          socialProfileUsername: taskData.socialProfileUsername,
          // Diğer görev tipleri için alanları temizle
          adMobUnitId: null,
          youtubeVideoId: null,
          youtubeVideoTitle: null,
          youtubeRequiredWatchTimeSeconds: null,
          youtubeAnswerKeywords: null,
          tweetUrl: null,
          twitterUsername: null
        };
        break;
    }
    const updatedTask = await db.update(tasks).set({
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      reward: taskData.reward.toString(),
      cooldownHours: taskData.cooldownHours.toString(),
      isActive: taskData.isActive,
      isOneTime: taskData.isOneTime,
      updatedAt: /* @__PURE__ */ new Date(),
      ...specialFields
    }).where(eq5(tasks.id, taskId)).returning();
    if (!updatedTask.length) {
      return res.status(404).json({ error: "G\xF6rev bulunamad\u0131" });
    }
    res.json(updatedTask[0]);
  } catch (error) {
    log(`Error updating task: ${error}`);
    res.status(500).json({ error: "G\xF6rev g\xFCncellenirken bir hata olu\u015Ftu" });
  }
}
async function handleDeleteTask(req, res) {
  try {
    if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Bu i\u015Flem i\xE7in yetkiniz yok" });
    }
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Ge\xE7ersiz g\xF6rev ID" });
    }
    const deletedTask = await db.delete(tasks).where(eq5(tasks.id, taskId)).returning();
    if (!deletedTask.length) {
      return res.status(404).json({ error: "G\xF6rev bulunamad\u0131" });
    }
    res.json({
      success: true,
      message: "G\xF6rev ba\u015Far\u0131yla silindi",
      id: taskId
    });
  } catch (error) {
    log(`Error deleting task: ${error}`);
    res.status(500).json({ error: "G\xF6rev silinirken bir hata olu\u015Ftu" });
  }
}
async function handleGetTasks(req, res) {
  try {
    const isDemo = req.query.demo === "true";
    if (!isDemo && !req.isAuthenticated()) {
      return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
    }
    if (isDemo) {
      const demoTasks = [
        {
          id: 999,
          title: "Reklam \u0130zle (Demo)",
          description: "G\xFCnl\xFCk reklam izleyerek \xF6d\xFCl kazan. Bu bir demo g\xF6revidir, giri\u015F yaparak ger\xE7ek \xF6d\xFCller kazanabilirsiniz.",
          type: "ad",
          reward: "5.0000",
          cooldownHours: "4.0000",
          imageUrl: null,
          isActive: true,
          order: 1,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          isCompleted: false,
          cooldownExpiresAt: null,
          canClaim: false,
          adMobUnitId: "demo-ad-unit"
        },
        {
          id: 998,
          title: "YouTube Video \u0130zle (Demo)",
          description: "YouTube video izleyip soru cevaplayarak \xF6d\xFCl kazan. Bu bir demo g\xF6revidir, giri\u015F yaparak ger\xE7ek \xF6d\xFCller kazanabilirsiniz.",
          type: "youtube",
          reward: "10.0000",
          cooldownHours: "24.0000",
          imageUrl: null,
          isActive: true,
          order: 2,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          isCompleted: false,
          cooldownExpiresAt: null,
          canClaim: false,
          youtubeVideoId: "dQw4w9WgXcQ",
          youtubeVideoTitle: "Demo Video"
        },
        {
          id: 997,
          title: "Twitter Payla\u015F\u0131m\u0131 (Demo)",
          description: "Twitter'da payla\u015F\u0131m yaparak \xF6d\xFCl kazan. Bu bir demo g\xF6revidir, giri\u015F yaparak ger\xE7ek \xF6d\xFCller kazanabilirsiniz.",
          type: "twitter",
          reward: "15.0000",
          cooldownHours: "72.0000",
          imageUrl: null,
          isActive: true,
          order: 3,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          isCompleted: false,
          cooldownExpiresAt: null,
          canClaim: false,
          tweetUrl: "https://twitter.com/intent/tweet?text=Goal%20Manager%20ile%20futbol%20deneyimini%20blockchain%20ile%20birle\u015Ftir"
        }
      ];
      return res.json({ tasks: demoTasks, isDemo: true });
    }
    const userId = req.user.id;
    const tasks3 = await storage.getActiveTasksForUser(userId);
    res.json({ tasks: tasks3, isDemo: false });
  } catch (error) {
    log(`Error getting tasks: ${error}`);
    res.status(500).json({ error: "G\xF6revler getirilirken bir hata olu\u015Ftu" });
  }
}
async function handleCompleteTask(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Giri\u015F yapmal\u0131s\u0131n\u0131z" });
    }
    const userId = req.user.id;
    const validation = completeTaskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Ge\xE7ersiz g\xF6rev verisi", details: validation.error });
    }
    const { taskId, validationData } = validation.data;
    const task = await storage.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: "G\xF6rev bulunamad\u0131" });
    }
    if (!task.isActive) {
      return res.status(400).json({ error: "Bu g\xF6rev \u015Fu anda aktif de\u011Fil" });
    }
    if (task.isOneTime) {
      const isCompleted = await storage.isTaskCompleted(userId, taskId);
      if (isCompleted) {
        return res.status(400).json({ error: "Bu g\xF6revi zaten tamamlad\u0131n\u0131z" });
      }
    }
    const cooldown = await storage.checkTaskCooldown(userId, taskId);
    if (cooldown) {
      return res.status(400).json({
        error: "Bu g\xF6revi \u015Fu anda tamamlayamazs\u0131n\u0131z",
        cooldownExpiresAt: cooldown.expiresAt
      });
    }
    let isValid = true;
    let validationError = "";
    switch (task.type) {
      case "youtube":
        if (!validationData?.answer) {
          isValid = false;
          validationError = "Video sorusuna cevap verilmedi";
        } else if (task.youtubeAnswerKeywords && task.youtubeAnswerKeywords.length > 0) {
          const userAnswer = validationData.answer.toLowerCase().trim();
          const validKeywords = task.youtubeAnswerKeywords.map((k) => k.toLowerCase().trim());
          const hasMatch = validKeywords.some((vk) => userAnswer.includes(vk));
          if (!hasMatch) {
            isValid = false;
            validationError = "Video cevab\u0131n\u0131z hatal\u0131, l\xFCtfen videoyu dikkatle izleyin";
          }
        }
        break;
      case "twitter":
        if (!validationData?.tweetLink || !validationData?.screenshotProof) {
          isValid = false;
          validationError = "Tweet payla\u015F\u0131m do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z. Tweet linki ve ekran g\xF6r\xFCnt\xFCs\xFC gerekli";
        }
        break;
      case "social_follow":
        if (!validationData?.profileLink || !validationData?.screenshotProof) {
          isValid = false;
          validationError = "Takip etme do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z. Profil linki ve ekran g\xF6r\xFCnt\xFCs\xFC gerekli";
        }
        break;
      case "ad":
        if (!validationData?.adCompleted) {
          isValid = false;
          validationError = "Reklam izleme do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z. L\xFCtfen reklam\u0131 sonuna kadar izleyin.";
        }
        break;
    }
    if (!isValid) {
      return res.status(400).json({ error: validationError });
    }
    const completedTask = await storage.completeTask({
      userId,
      taskId,
      earnedReward: task.reward,
      validationData
    });
    if (!task.isOneTime) {
      const cooldownHours = Number(task.cooldownHours);
      const expiresAt = addHours(/* @__PURE__ */ new Date(), cooldownHours);
      await storage.createTaskCooldown({
        userId,
        taskId,
        expiresAt
      });
    }
    res.json({
      success: true,
      task: completedTask,
      reward: task.reward
    });
  } catch (error) {
    log(`Error completing task: ${error}`);
    res.status(500).json({ error: "G\xF6rev tamamlan\u0131rken bir hata olu\u015Ftu" });
  }
}
async function handleGetTaskCompletions(req, res) {
  try {
    if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Bu i\u015Flem i\xE7in yetkiniz yok" });
    }
    const { taskId, userId, status } = req.query;
    res.status(501).json({ error: "Bu i\u015Flevsellik hen\xFCz uygulanmad\u0131" });
  } catch (error) {
    log(`Error getting task completions: ${error}`);
    res.status(500).json({ error: "G\xF6rev tamamlama verileri al\u0131n\u0131rken bir hata olu\u015Ftu" });
  }
}

// server/routes/faq.ts
import { eq as eq6 } from "drizzle-orm";
async function handleGetActiveFAQItems(_req, res) {
  try {
    const faqItems = await db.select().from(faq).where(eq6(faq.isActive, true)).orderBy(faq.order);
    return res.json(faqItems);
  } catch (error) {
    console.error("Error fetching active FAQ items:", error);
    return res.status(500).json({
      message: "Aktif SSS \xF6\u011Feleri al\u0131n\u0131rken bir hata olu\u015Ftu"
    });
  }
}

// server/routes/admin/faq.ts
import { eq as eq7 } from "drizzle-orm";
import { z as z4 } from "zod";
var createFaqSchema = z4.object({
  question: z4.string().min(5, "Soru en az 5 karakter olmal\u0131d\u0131r"),
  answer: z4.string().min(5, "Cevap en az 5 karakter olmal\u0131d\u0131r"),
  category: z4.string().default("Genel"),
  isActive: z4.boolean().default(true),
  language: z4.string().default("tr"),
  order: z4.number().optional()
});
var updateFaqSchema = z4.object({
  id: z4.number(),
  question: z4.string().min(5, "Soru en az 5 karakter olmal\u0131d\u0131r").optional(),
  answer: z4.string().min(5, "Cevap en az 5 karakter olmal\u0131d\u0131r").optional(),
  category: z4.string().optional(),
  isActive: z4.boolean().optional(),
  language: z4.string().optional(),
  order: z4.number().optional()
});
var reorderFaqSchema = z4.object({
  orders: z4.array(
    z4.object({
      id: z4.number(),
      order: z4.number()
    })
  )
});
async function handleAdminGetAllFAQItems(_req, res) {
  try {
    const faqItems = await db.select().from(faq).orderBy(faq.order);
    return res.json(faqItems);
  } catch (error) {
    console.error("Error fetching FAQ items:", error);
    return res.status(500).json({
      message: "SSS \xF6\u011Feleri al\u0131n\u0131rken bir hata olu\u015Ftu"
    });
  }
}
async function handleCreateFAQItem(req, res) {
  try {
    const validation = createFaqSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Ge\xE7ersiz veri",
        errors: validation.error.format()
      });
    }
    const existingItems = await db.select({ order: faq.order }).from(faq).where(eq7(faq.category, validation.data.category || "Genel")).orderBy(faq.order, "desc").limit(1);
    let orderValue = validation.data.order;
    if (!orderValue && existingItems.length > 0) {
      orderValue = (existingItems[0].order || 0) + 1;
    }
    const newFaqItem = await db.insert(faq).values({
      ...validation.data,
      order: orderValue,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return res.status(201).json(newFaqItem[0]);
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    return res.status(500).json({
      message: "SSS \xF6\u011Fesi olu\u015Fturulurken bir hata olu\u015Ftu"
    });
  }
}
async function handleUpdateFAQItem(req, res) {
  try {
    const { id } = req.params;
    const faqId = parseInt(id);
    if (isNaN(faqId)) {
      return res.status(400).json({ message: "Ge\xE7ersiz SSS ID" });
    }
    const validation = updateFaqSchema.safeParse({
      ...req.body,
      id: faqId
    });
    if (!validation.success) {
      return res.status(400).json({
        message: "Ge\xE7ersiz veri",
        errors: validation.error.format()
      });
    }
    const { id: _, ...updateData } = validation.data;
    const updatedFaqItem = await db.update(faq).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq7(faq.id, faqId)).returning();
    if (!updatedFaqItem.length) {
      return res.status(404).json({ message: "SSS \xF6\u011Fesi bulunamad\u0131" });
    }
    return res.json(updatedFaqItem[0]);
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return res.status(500).json({
      message: "SSS \xF6\u011Fesi g\xFCncellenirken bir hata olu\u015Ftu"
    });
  }
}
async function handleDeleteFAQItem(req, res) {
  try {
    const { id } = req.params;
    const faqId = parseInt(id);
    if (isNaN(faqId)) {
      return res.status(400).json({ message: "Ge\xE7ersiz SSS ID" });
    }
    const deletedFaqItem = await db.delete(faq).where(eq7(faq.id, faqId)).returning();
    if (!deletedFaqItem.length) {
      return res.status(404).json({ message: "SSS \xF6\u011Fesi bulunamad\u0131" });
    }
    return res.json({
      message: "SSS \xF6\u011Fesi ba\u015Far\u0131yla silindi",
      id: faqId
    });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return res.status(500).json({
      message: "SSS \xF6\u011Fesi silinirken bir hata olu\u015Ftu"
    });
  }
}
async function handleChangeFAQItemOrder(req, res) {
  try {
    const validation = reorderFaqSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Ge\xE7ersiz veri",
        errors: validation.error.format()
      });
    }
    const { orders } = validation.data;
    const result = await db.transaction(async (tx) => {
      const results = [];
      for (const { id, order } of orders) {
        const updated = await tx.update(faq).set({ order, updatedAt: /* @__PURE__ */ new Date() }).where(eq7(faq.id, id)).returning();
        results.push(updated[0]);
      }
      return results;
    });
    return res.json({
      message: "SSS \xF6\u011Feleri s\u0131ralamas\u0131 ba\u015Far\u0131yla g\xFCncellendi",
      items: result
    });
  } catch (error) {
    console.error("Error reordering FAQ items:", error);
    return res.status(500).json({
      message: "SSS \xF6\u011Feleri s\u0131ralamas\u0131 g\xFCncellenirken bir hata olu\u015Ftu"
    });
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/admin/news", isAdmin, async (req, res) => {
    try {
      const newsList = await db.select().from(news).orderBy(news.order);
      res.status(200).json(newsList);
    } catch (error) {
      res.status(500).json({ error: error.message || "Haberler al\u0131n\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/admin/news", isAdmin, async (req, res) => {
    try {
      const newsData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl || null,
        link: req.body.link || null,
        isActive: req.body.isActive !== void 0 ? req.body.isActive : true,
        order: req.body.order || 0
      };
      const [inserted] = await db.insert(news).values(newsData).returning();
      const responseData = {
        ...inserted,
        imageUrl: inserted.imageUrl,
        isActive: inserted.isActive
      };
      res.status(201).json(responseData);
    } catch (error) {
      console.error("Haber ekleme hatas\u0131:", error);
      res.status(500).json({ error: error.message || "Haber eklenirken bir hata olu\u015Ftu" });
    }
  });
  app2.put("/api/admin/news/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Ge\xE7ersiz haber ID" });
      }
      const newsData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl || null,
        link: req.body.link || null,
        isActive: req.body.isActive !== void 0 ? req.body.isActive : true,
        order: req.body.order || 0
      };
      const [updated] = await db.update(news).set(newsData).where(eq8(news.id, id)).returning();
      if (!updated) {
        return res.status(404).json({ error: "Haber bulunamad\u0131" });
      }
      const responseData = {
        ...updated,
        imageUrl: updated.imageUrl,
        isActive: updated.isActive
      };
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Haber g\xFCncelleme hatas\u0131:", error);
      res.status(500).json({ error: error.message || "Haber g\xFCncellenirken bir hata olu\u015Ftu" });
    }
  });
  app2.delete("/api/admin/news/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Ge\xE7ersiz haber ID" });
      }
      await db.delete(news).where(eq8(news.id, id));
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message || "Haber silinirken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/admin/news/reorder", isAdmin, async (req, res) => {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        return res.status(400).json({ error: "Ge\xE7ersiz s\u0131ralama verisi" });
      }
      await db.transaction(async (tx) => {
        for (const item of orders) {
          await tx.update(news).set({ order: item.order }).where(eq8(news.id, item.id));
        }
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message || "Haberler yeniden s\u0131ralan\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/generate-demo-news", isAdmin, async (req, res) => {
    try {
      await db.delete(news);
      const demoNews = [
        {
          title: "Goal Manager Yeni G\xFCncelleme",
          description: "Goal Manager'\u0131n yeni s\xFCr\xFCm\xFC yay\u0131nland\u0131! Hemen g\xFCncelleyerek yeni \xF6zelliklere eri\u015Fin.",
          imageUrl: "/miningcard.png",
          link: "https://www.goalmanager.io/updates",
          isActive: true,
          order: 1
        },
        {
          title: "Blockchain Teknolojisinde Yenilik",
          description: "Goal Manager, Futbol Menajerli\u011Finde Blockchain Teknolojisini Kullanarak Oyun Deneyimini D\xF6n\xFC\u015Ft\xFCr\xFCyor!",
          imageUrl: "/\xFCst.png",
          link: "https://www.goalmanager.io/blockchain",
          isActive: true,
          order: 2
        },
        {
          title: "Haftal\u0131k Turnuva Ba\u015Flad\u0131",
          description: "Bu haftaki \xF6zel turnuvam\u0131z ba\u015Flad\u0131! Kat\u0131larak 5000 GM Token kazanma \u015Fans\u0131 yakalay\u0131n.",
          imageUrl: "/fertlogo.png",
          link: "https://www.goalmanager.io/tournament",
          isActive: true,
          order: 3
        },
        {
          title: "GM Token Piyasada",
          description: "GM Token art\u0131k kripto para borsalar\u0131nda i\u015Flem g\xF6r\xFCyor. Yat\u0131r\u0131m f\u0131rsat\u0131n\u0131 ka\xE7\u0131rmay\u0131n!",
          imageUrl: "/card.png",
          link: "https://www.goalmanager.io/token",
          isActive: true,
          order: 4
        }
      ];
      const insertedNews = await db.insert(news).values(demoNews).returning();
      res.status(201).json({
        success: true,
        message: "Demo haberler ba\u015Far\u0131yla olu\u015Fturuldu",
        count: insertedNews.length,
        news: insertedNews
      });
    } catch (error) {
      console.error("Demo haber olu\u015Fturma hatas\u0131:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Demo haberler olu\u015Fturulurken bir hata olu\u015Ftu"
      });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const newsItems = await db.select().from(news).orderBy(asc(news.order));
      const formattedNewsItems = newsItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl || "/fertlogo.png",
        // Varsayılan logo
        link: item.link,
        isActive: item.isActive !== void 0 ? item.isActive : true,
        order: item.order,
        createdAt: item.createdAt?.toISOString()
      }));
      res.status(200).json(formattedNewsItems || []);
    } catch (error) {
      console.error("Haberler al\u0131n\u0131rken hata:", error);
      res.status(500).json({ error: error.message || "Haberler al\u0131n\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.get("/api/image-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Ge\xE7ersiz URL parametresi" });
      }
      let fullUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        fullUrl = `${req.protocol}://${req.get("host")}/${url}`;
      }
      let response;
      try {
        response = await fetch(fullUrl);
      } catch (error) {
        console.error("Resim proxy hatas\u0131:", error);
        return res.status(500).json({ error: "Resim i\u015Flenirken bir hata olu\u015Ftu", details: error.message });
      }
      if (response && !response.ok) {
        return res.status(response.status).json({ error: "Resim al\u0131namad\u0131" });
      }
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      res.setHeader("Cache-Control", "public, max-age=86400");
      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Resim proxy hatas\u0131:", error);
      res.status(500).json({ error: "Resim i\u015Flenirken bir hata olu\u015Ftu" });
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const { search } = req.query;
      let query = db.select().from(users);
      if (search && typeof search === "string" && search.trim() !== "") {
        const searchTerm = `%${search.trim()}%`;
        query = query.where(
          sql3`${users.username} ILIKE ${searchTerm} OR ${users.walletAddress} ILIKE ${searchTerm} OR CAST(${users.id} AS TEXT) = ${search.trim()}`
        );
      }
      const usersList = await query.orderBy(desc3(users.id));
      const safeUsersList = usersList.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        balance: user.balance,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        lastAirdropClaim: user.lastAirdropClaim,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
        kycStatus: user.kycStatus
      }));
      res.status(200).json(safeUsersList);
    } catch (error) {
      console.error("Admin users fetch error:", error);
      res.status(500).json({ error: error.message || "Kullan\u0131c\u0131lar al\u0131n\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.get("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Ge\xE7ersiz kullan\u0131c\u0131 ID" });
      }
      const [user] = await db.select().from(users).where(eq8(users.id, userId));
      if (!user) {
        return res.status(404).json({ error: "Kullan\u0131c\u0131 bulunamad\u0131" });
      }
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        balance: user.balance,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        lastAirdropClaim: user.lastAirdropClaim,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
        kycStatus: user.kycStatus
      };
      res.status(200).json(safeUser);
    } catch (error) {
      console.error("Admin user fetch error:", error);
      res.status(500).json({ error: error.message || "Kullan\u0131c\u0131 al\u0131n\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.put("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Ge\xE7ersiz kullan\u0131c\u0131 ID" });
      }
      const { username, walletAddress, balance, kycStatus } = req.body;
      const updateData = {};
      if (username !== void 0) updateData.username = username;
      if (walletAddress !== void 0) updateData.walletAddress = walletAddress;
      if (balance !== void 0) updateData.balance = balance;
      if (kycStatus !== void 0) updateData.kycStatus = kycStatus;
      const [updatedUser] = await db.update(users).set(updateData).where(eq8(users.id, userId)).returning();
      if (!updatedUser) {
        return res.status(404).json({ error: "Kullan\u0131c\u0131 bulunamad\u0131" });
      }
      const safeUser = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        walletAddress: updatedUser.walletAddress,
        balance: updatedUser.balance,
        referralCode: updatedUser.referralCode,
        referredBy: updatedUser.referredBy,
        lastAirdropClaim: updatedUser.lastAirdropClaim,
        createdAt: updatedUser.createdAt,
        isAdmin: updatedUser.isAdmin,
        kycStatus: updatedUser.kycStatus
      };
      res.status(200).json(safeUser);
    } catch (error) {
      console.error("Admin user update error:", error);
      res.status(500).json({ error: error.message || "Kullan\u0131c\u0131 g\xFCncellenirken bir hata olu\u015Ftu" });
    }
  });
  app2.get("/api/admin/users/export/csv", isAdmin, async (req, res) => {
    try {
      const usersList = await db.select().from(users);
      let csvContent = "ID,Kullan\u0131c\u0131 Ad\u0131,E-posta,C\xFCzdan Adresi,Bakiye,Referans Kodu,Eklenme Tarihi,KYC Durumu\n";
      usersList.forEach((user) => {
        const createdAtFormatted = user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "";
        csvContent += `${user.id},"${user.username}","${user.email || ""}","${user.walletAddress || ""}",${user.balance},"${user.referralCode || ""}","${createdAtFormatted}","${user.kycStatus || "unverified"}"
`;
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=kullanicilar.csv");
      res.status(200).send(csvContent);
    } catch (error) {
      console.error("Admin users export error:", error);
      res.status(500).json({ error: error.message || "Kullan\u0131c\u0131lar d\u0131\u015Fa aktar\u0131l\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/mining/claim", handleClaimMining);
  app2.post("/api/mining/start-cycle", handleStartNewCycle);
  app2.post("/api/mining/admob-reward", handleClaimAdMobReward);
  app2.get("/api/mining/status", handleGetMiningStatus);
  app2.get("/api/mining/history", handleGetMiningHistory);
  app2.post("/api/airdrop/claim", handleClaimMining);
  app2.post("/api/airdrop/start-cycle", handleStartNewCycle);
  app2.get("/api/airdrop/status", handleGetMiningStatus);
  app2.get("/api/airdrop/history", handleGetMiningHistory);
  app2.get("/api/admin/social-media", isAdmin, async (req, res) => {
    try {
      const [settings] = await db.select().from(systemSettings).limit(1);
      if (!settings) {
        return res.status(404).json({ error: "Ayarlar bulunamad\u0131" });
      }
      const socialMediaSettings = {
        twitterUrl: settings.twitterUrl || null,
        facebookUrl: settings.facebookUrl || null,
        instagramUrl: settings.instagramUrl || null,
        youtubeUrl: settings.youtubeUrl || null,
        websiteUrl: settings.websiteUrl || null
      };
      res.status(200).json(socialMediaSettings);
    } catch (error) {
      console.error("Sosyal medya ayarlar\u0131 al\u0131n\u0131rken hata:", error);
      res.status(500).json({ error: error.message || "Sosyal medya ayarlar\u0131 al\u0131n\u0131rken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/admin/social-media", isAdmin, async (req, res) => {
    try {
      const socialMediaSchema = z5.object({
        twitterUrl: z5.string().url("Ge\xE7erli bir URL giriniz").nullish(),
        facebookUrl: z5.string().url("Ge\xE7erli bir URL giriniz").nullish(),
        instagramUrl: z5.string().url("Ge\xE7erli bir URL giriniz").nullish(),
        youtubeUrl: z5.string().url("Ge\xE7erli bir URL giriniz").nullish(),
        websiteUrl: z5.string().url("Ge\xE7erli bir URL giriniz").nullish()
      });
      const cleanData = {
        twitterUrl: req.body.twitterUrl || null,
        facebookUrl: req.body.facebookUrl || null,
        instagramUrl: req.body.instagramUrl || null,
        youtubeUrl: req.body.youtubeUrl || null,
        websiteUrl: req.body.websiteUrl || null
      };
      const validatedData = socialMediaSchema.parse(cleanData);
      const [settings] = await db.select().from(systemSettings).limit(1);
      if (settings) {
        await db.update(systemSettings).set({
          ...validatedData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq8(systemSettings.id, settings.id));
      } else {
        await db.insert(systemSettings).values({
          dailyAirdropAmount: "100.0000",
          weeklyAirdropAmount: "2100.0000",
          referralBonusAmount: "50.0000",
          referralBonusRate: "10.0000",
          airdropCooldownHours: "24.0000",
          ...validatedData,
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      res.status(200).json({
        success: true,
        message: "Sosyal medya ayarlar\u0131 g\xFCncellendi",
        ...validatedData
      });
    } catch (error) {
      console.error("Sosyal medya ayarlar\u0131 g\xFCncellenirken hata:", error);
      if (error.errors) {
        return res.status(400).json({
          error: "Ge\xE7ersiz sosyal medya ba\u011Flant\u0131lar\u0131",
          details: error.errors
        });
      }
      res.status(500).json({
        error: error.message || "Sosyal medya ayarlar\u0131 g\xFCncellenirken bir hata olu\u015Ftu"
      });
    }
  });
  app2.post("/api/auth/request-reset", async (req, res) => {
    try {
      const { email, username } = req.body;
      if (!email || !username) {
        return res.status(400).json({ success: false, message: "E-posta adresi ve kullan\u0131c\u0131 ad\u0131 gereklidir" });
      }
      const result = await requestPasswordReset(email, username);
      return res.status(200).json(result);
    } catch (error) {
      console.error("\u015Eifre s\u0131f\u0131rlama ba\u011Flant\u0131s\u0131 g\xF6nderme hatas\u0131:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "\u015Eifre s\u0131f\u0131rlama ba\u011Flant\u0131s\u0131 g\xF6nderilirken bir hata olu\u015Ftu"
      });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email, username } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Email adresi gereklidir" });
      }
      if (!username) {
        return res.status(400).json({ success: false, message: "Kullan\u0131c\u0131 ad\u0131 gereklidir" });
      }
      const result = await requestPasswordReset(email, username);
      return res.status(200).json(result);
    } catch (error) {
      console.error("\u015Eifre s\u0131f\u0131rlama hatas\u0131:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "\u015Eifre s\u0131f\u0131rlama i\u015Flemi s\u0131ras\u0131nda bir hata olu\u015Ftu"
      });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token ve yeni \u015Fifre gereklidir"
        });
      }
      const result = await resetPasswordWithToken(token, newPassword);
      return res.status(200).json(result);
    } catch (error) {
      console.error("\u015Eifre yenileme hatas\u0131:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "\u015Eifre yenileme i\u015Flemi s\u0131ras\u0131nda bir hata olu\u015Ftu"
      });
    }
  });
  app2.post("/api/auth/reset-password-direct", async (req, res) => {
    try {
      const { email, username } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Email adresi gereklidir" });
      }
      if (!username) {
        return res.status(400).json({ success: false, message: "Kullan\u0131c\u0131 ad\u0131 gereklidir" });
      }
      const result = await resetPasswordAndSendEmail(email, username);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Do\u011Frudan \u015Fifre s\u0131f\u0131rlama hatas\u0131:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "\u015Eifre s\u0131f\u0131rlama i\u015Flemi s\u0131ras\u0131nda bir hata olu\u015Ftu"
      });
    }
  });
  app2.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
      const totalUsersResult = await db.select({ count: sql3`count(*)` }).from(users);
      const totalUsers = totalUsersResult[0]?.count || 0;
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersResult = await db.select({ count: sql3`count(*)` }).from(users).where(sql3`${users.createdAt} >= ${today}::timestamp`);
      const newUsersToday = newUsersResult[0]?.count || 0;
      const totalMinedResult = await db.select({ sum: sql3`SUM(${airdropClaims.amount})` }).from(airdropClaims);
      const totalMined = Number(totalMinedResult[0]?.sum || "0");
      const dailyClaimsResult = await db.select({ sum: sql3`SUM(${airdropClaims.amount})` }).from(airdropClaims).where(sql3`${airdropClaims.claimedAt} >= ${today}::timestamp`);
      const dailyRewards = Number(dailyClaimsResult[0]?.sum || "0");
      const yesterday = /* @__PURE__ */ new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeUsersResult = await db.select({ count: sql3`count(DISTINCT ${airdropClaims.userId})` }).from(airdropClaims).where(sql3`${airdropClaims.claimedAt} >= ${yesterday}::timestamp`);
      const activeUsers = activeUsersResult[0]?.count || 0;
      const [settings] = await db.select().from(systemSettings).limit(1);
      res.json({
        totalUsers,
        newUsersToday,
        totalMined,
        dailyRewards,
        activeUsers,
        settings: settings || {
          dailyAirdropAmount: "50.0000",
          weeklyAirdropAmount: "2100.0000",
          referralBonusAmount: "50.0000",
          airdropCooldownHours: "0.0167"
        }
      });
    } catch (error) {
      console.error("Admin stats fetch error:", error);
      res.status(500).json({ message: "\u0130statistikler al\u0131namad\u0131", error: String(error) });
    }
  });
  app2.get("/api/admin/system-settings", isAdmin, async (req, res) => {
    try {
      const [settings] = await db.select().from(systemSettings).limit(1);
      res.json(settings || {
        dailyAirdropAmount: "100.0000",
        weeklyAirdropAmount: "500.0000",
        referralBonusAmount: "50.0000",
        airdropCooldownHours: 24
      });
    } catch (error) {
      console.error("System settings fetch error:", error);
      res.status(500).json({ message: "Sistem ayarlar\u0131 al\u0131namad\u0131" });
    }
  });
  app2.post("/api/admin/update-settings", isAdmin, async (req, res) => {
    try {
      const { dailyAirdropAmount, weeklyAirdropAmount, referralBonusAmount, airdropCooldownHours } = req.body;
      const [settings] = await db.select().from(systemSettings).limit(1);
      if (settings) {
        const [updatedSettings] = await db.update(systemSettings).set({
          dailyAirdropAmount,
          weeklyAirdropAmount,
          referralBonusAmount,
          airdropCooldownHours,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        res.json(updatedSettings);
      } else {
        const [newSettings] = await db.insert(systemSettings).values({
          dailyAirdropAmount,
          weeklyAirdropAmount,
          referralBonusAmount,
          airdropCooldownHours,
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        res.json(newSettings);
      }
    } catch (error) {
      console.error("System settings update error:", error);
      res.status(500).json({ message: "Sistem ayarlar\u0131 g\xFCncellenemedi" });
    }
  });
  app2.post("/api/admin/toggle-mining", isAdmin, async (req, res) => {
    try {
      const { userId, action, hourlyRate } = req.body;
      if (!userId || !action) {
        return res.status(400).json({ message: "Eksik parametreler" });
      }
      const [settings] = await db.select().from(systemSettings).limit(1);
      const cycleDurationMinutes = settings?.miningCycleDuration || 1440;
      const [user] = await db.update(users).set({
        isMining: action === "start",
        miningEndTime: action === "start" ? new Date(Date.now() + cycleDurationMinutes * 60 * 1e3) : null,
        lastMiningUpdate: action === "start" ? /* @__PURE__ */ new Date() : null,
        hourlyRate: hourlyRate || settings?.defaultHourlyRate || "5.0000"
      }).where(eq8(users.id, userId)).returning();
      res.json(user);
    } catch (error) {
      console.error("Admin mining toggle error:", error);
      res.status(500).json({ message: "Mining durumu g\xFCncellenemedi" });
    }
  });
  app2.post("/api/mine", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userId = req.user.id;
      const status = await storage.getMiningStatus(userId);
      if (!status.isMining || !status.endTime || status.endTime < /* @__PURE__ */ new Date()) {
        console.log("Mining aktif de\u011Fil - otomatik ba\u015Flat\u0131l\u0131yor...");
        try {
          await storage.startMining(userId);
          const newStatus = await storage.getMiningStatus(userId);
          status.isMining = newStatus.isMining;
          status.endTime = newStatus.endTime;
          status.lastUpdate = newStatus.lastUpdate;
          console.log("Mining otomatik ba\u015Flat\u0131ld\u0131:", { userId, newStatus });
        } catch (err) {
          console.error("Mining otomatik ba\u015Flatma hatas\u0131:", err);
          return res.status(500).json({ message: "Mining ba\u015Flat\u0131lamad\u0131" });
        }
      }
      const now = /* @__PURE__ */ new Date();
      const lastUpdate = status.lastUpdate;
      const actualTimeDiff = (now.getTime() - lastUpdate.getTime()) / 1e3;
      const timeDiff = Math.max(60, actualTimeDiff);
      const [settings] = await db.select().from(systemSettings).limit(1).catch(() => [{
        defaultHourlyRate: "8.0000",
        referralBonusRate: "15.00",
        miningCycleDuration: 1
      }]);
      const activeReferralsCount = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.referredBy} = ${userId} AND ${users.isMining} = true`
      ).then((result) => result[0]?.count || 0).catch(() => 0);
      const hourlyRate = Number(settings?.defaultHourlyRate || "8.0000");
      const referralBonusRate = Number(settings?.referralBonusRate || "15.00") / 100;
      const referralBonus = activeReferralsCount * referralBonusRate * hourlyRate;
      const totalHourlyRate = hourlyRate + referralBonus;
      const minuteRate = totalHourlyRate / 60;
      const secondRate = minuteRate / 60;
      const totalReward = secondRate * timeDiff;
      console.log("\xD6d\xFCl hesaplama detaylar\u0131:", {
        saatlikOran: totalHourlyRate,
        dakikalikOran: minuteRate,
        saniyeBasinaOran: secondRate,
        gecenSureSaniye: timeDiff,
        hesaplananOdul: totalReward
      });
      if (totalReward <= 0) {
        return res.status(400).json({ message: "Ge\xE7ersiz \xF6d\xFCl hesapland\u0131" });
      }
      const formattedReward = Number(totalReward.toFixed(4));
      try {
        await db.transaction(async (tx) => {
          console.log("Mining transaction ba\u015Flat\u0131ld\u0131 - G\xFCvenli c\xFCzdan g\xFCncellemesi");
          await tx.insert(transactions).values({
            userId,
            amount: formattedReward.toString(),
            type: "mining",
            createdAt: /* @__PURE__ */ new Date()
          });
          console.log(`Mining istatisti\u011Fi kaydedildi - Kullan\u0131c\u0131: ${userId}, Miktar: ${formattedReward}`);
          const [updatedUser] = await tx.update(users).set({
            balance: sql3`${users.balance}::decimal + ${formattedReward}::decimal`,
            lastMiningUpdate: now
          }).where(eq8(users.id, userId)).returning();
          console.log(`Bakiye g\xFCncellendi - Kullan\u0131c\u0131: ${userId}, Yeni Bakiye: ${updatedUser.balance}`);
          res.json({
            success: true,
            reward: formattedReward,
            balance: updatedUser.balance,
            hourlyRate: totalHourlyRate,
            referralBonus,
            activeReferrals: activeReferralsCount,
            timeDiff
          });
        });
      } catch (error) {
        console.error("Mining transaction hatas\u0131:", error);
        throw error;
      }
    } catch (error) {
      console.error("Mining error:", error);
      res.status(500).json({ message: "Mining i\u015Flemi ba\u015Far\u0131s\u0131z oldu" });
    }
  });
  app2.post("/api/start-mining", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userId = req.user.id;
      await storage.startMining(userId);
      const [user] = await db.select().from(users).where(eq8(users.id, userId));
      res.json({
        success: true,
        isMining: user.isMining,
        endTime: user.miningEndTime
      });
    } catch (error) {
      console.error("Start mining error:", error);
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
      res.status(500).json({ message: "Mining ba\u015Flat\u0131lamad\u0131: " + errorMessage });
    }
  });
  app2.get("/api/mining-status", async (req, res) => {
    try {
      const [settings] = await db.select().from(systemSettings).limit(1);
      if (!req.isAuthenticated()) {
        return res.json({
          isMining: false,
          endTime: null,
          lastUpdate: /* @__PURE__ */ new Date(),
          hourlyRate: Number(settings?.defaultHourlyRate || "10.0000"),
          referralBonus: 0,
          totalHourlyRate: Number(settings?.defaultHourlyRate || "10.0000"),
          activeReferrals: 0,
          cycleDuration: settings?.miningCycleDuration || 1
        });
      }
      const userId = req.user.id;
      const [user] = await db.select().from(users).where(eq8(users.id, userId));
      const cooldownSettingsForActiveUsers = await db.select().from(systemSettings).limit(1);
      const cooldownHoursForUserReferrals = Number(cooldownSettingsForActiveUsers[0]?.airdropCooldownHours || 24);
      const currentTimeForUserReferrals = /* @__PURE__ */ new Date();
      const referrals = await storage.getUserReferrals(userId);
      const activeReferrals = referrals.filter((r) => {
        if (!r.lastAirdropClaim) return false;
        const lastClaimTime = new Date(r.lastAirdropClaim);
        const hoursSinceLastClaim = (currentTimeForUserReferrals.getTime() - lastClaimTime.getTime()) / (1e3 * 60 * 60);
        return hoursSinceLastClaim < cooldownHoursForUserReferrals;
      });
      const defaultRate = Number(settings?.defaultHourlyRate || "10.0000");
      const hourlyRate = defaultRate;
      const referralBonusRate = Number(settings?.referralBonusRate || 10) / 100;
      const referralBonus = activeReferrals.length * referralBonusRate * hourlyRate;
      console.log("Mining status rate calculation:", {
        defaultSystemRate: defaultRate,
        finalRate: hourlyRate,
        referralBonusRate,
        referralBonus,
        activeReferrals: activeReferrals.length
      });
      res.json({
        isMining: user.isMining,
        endTime: user.miningEndTime,
        lastUpdate: user.lastMiningUpdate,
        hourlyRate,
        referralBonus,
        totalHourlyRate: hourlyRate + referralBonus,
        activeReferrals: activeReferrals.length,
        cycleDuration: settings?.miningCycleDuration || 1440
      });
    } catch (error) {
      console.error("Mining status error:", error);
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
      res.status(500).json({ message: "Mining durumu al\u0131namad\u0131: " + errorMessage });
    }
  });
  app2.get("/api/mining-stats", async (req, res) => {
    try {
      const [settings] = await db.select().from(systemSettings).limit(1);
      console.log("Raw system settings:", settings);
      const totalUsersResult = await db.select({ count: sql3`count(*)` }).from(users);
      const totalUsers = Number(totalUsersResult[0].count);
      const [settingsForActiveUsers] = await db.select().from(systemSettings).limit(1);
      const cooldownHoursForActiveUsers = Number(settingsForActiveUsers?.airdropCooldownHours || 24);
      const currentTimeForActiveUsers = /* @__PURE__ */ new Date();
      const activeUsersResult = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.lastAirdropClaim} IS NOT NULL AND 
          EXTRACT(EPOCH FROM (${currentTimeForActiveUsers}::timestamp - ${users.lastAirdropClaim}::timestamp))/3600 < ${cooldownHoursForActiveUsers}`
      );
      console.log("\u0130statistik sayfas\u0131 i\xE7in aktif kullan\u0131c\u0131 hesaplama - cooldown s\xFCresi:", cooldownHoursForActiveUsers, "saat");
      const activeAirdropUsers = Number(activeUsersResult[0].count);
      const totalClaimedResult = await db.select({
        total: sql3`COALESCE(SUM(${airdropClaims.amount}::decimal), '0')`
      }).from(airdropClaims);
      const totalMined = Number(totalClaimedResult[0].total);
      if (!req.isAuthenticated()) {
        return res.json({
          totalUsers,
          activeAirdropUsers,
          totalMined,
          hourlyAirdropRate: {
            base: Number(settings?.dailyAirdropAmount || "300.0000") / 24,
            referralBonus: 0,
            total: Number(settings?.dailyAirdropAmount || "300.0000") / 24
          },
          totalReferralEarnings: 0,
          activeReferralsCount: 0,
          passiveReferralsCount: 0,
          totalReferralsCount: 0,
          airdrop: {
            dailyAmount: settings?.dailyAirdropAmount || "300.0000",
            weeklyAmount: settings?.weeklyAirdropAmount || "2100.0000",
            cooldownHours: parseFloat(settings?.airdropCooldownHours || "0.0167")
          },
          canClaim: false,
          nextClaimTime: null,
          referralBonus: settings?.referralBonusAmount || "50.0000"
        });
      }
      const userId = req.user.id;
      const [user] = await db.select().from(users).where(eq8(users.id, userId));
      console.log("User data:", {
        id: user.id,
        username: user.username,
        balance: user.balance,
        lastAirdropClaim: user.lastAirdropClaim
      });
      const referrals = await storage.getUserReferrals(userId);
      let canClaim = true;
      let nextClaimTime = null;
      if (user.lastAirdropClaim) {
        nextClaimTime = new Date(user.lastAirdropClaim);
        const cooldownHours2 = parseFloat(settings?.airdropCooldownHours || "24");
        console.log(`Cooldown hesaplan\u0131yor - ${cooldownHours2} saat (${cooldownHours2 * 60} dakika)`);
        const currentHours = nextClaimTime.getHours();
        const additionalHours = Math.floor(cooldownHours2);
        const additionalMinutes = Math.round((cooldownHours2 - additionalHours) * 60);
        nextClaimTime.setHours(currentHours + additionalHours);
        nextClaimTime.setMinutes(nextClaimTime.getMinutes() + additionalMinutes);
        console.log(`Son claim tarihi: ${user.lastAirdropClaim}`);
        console.log(`Sonraki claim tarihi: ${nextClaimTime.toISOString()}`);
        console.log(`\u015Eu anki tarih: ${(/* @__PURE__ */ new Date()).toISOString()}`);
        canClaim = nextClaimTime <= /* @__PURE__ */ new Date();
        console.log(`Talep edilebilir mi: ${canClaim}`);
      }
      let activeReferralsCount = 0;
      let totalReferralEarnings = 0;
      const totalReferralsResult = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.referrerId} = ${userId}`
      );
      const totalReferralsCount = Number(totalReferralsResult[0].count || 0);
      const settingsResult = await db.select().from(systemSettings).limit(1);
      const cooldownHours = Number(settingsResult[0]?.airdropCooldownHours || 24);
      console.log("Referans aktiflik kontrol\xFC i\xE7in cooldown s\xFCresi:", cooldownHours, "saat");
      const currentTime = /* @__PURE__ */ new Date();
      const activeReferralsResult = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.referrerId} = ${userId} AND 
            ${users.lastAirdropClaim} IS NOT NULL AND
            EXTRACT(EPOCH FROM (${currentTime}::timestamp - ${users.lastAirdropClaim}::timestamp))/3600 < ${cooldownHours}
          `
      );
      activeReferralsCount = Number(activeReferralsResult[0].count || 0);
      const passiveReferralsResult = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.referrerId} = ${userId} AND (
            ${users.lastAirdropClaim} IS NULL OR
            EXTRACT(EPOCH FROM (${currentTime}::timestamp - ${users.lastAirdropClaim}::timestamp))/3600 >= ${cooldownHours}
          )`
      );
      const passiveReferralsCount = Number(passiveReferralsResult[0].count || 0);
      if (activeReferralsCount + passiveReferralsCount !== totalReferralsCount) {
        console.warn("Referans say\u0131s\u0131 hesaplamada tutars\u0131zl\u0131k:", {
          toplam: totalReferralsCount,
          aktif: activeReferralsCount,
          pasif: passiveReferralsCount,
          hesaplananToplam: activeReferralsCount + passiveReferralsCount
        });
      }
      console.log("Referans say\u0131s\u0131 kontrol\xFC:", {
        userId,
        totalReferralsCount,
        activeReferralsCount,
        passiveReferralsCount
      });
      const totalReferralBonusResult = await db.select({
        total: sql3`COALESCE(SUM(${transactions.amount}::decimal), '0')`
      }).from(transactions).where(
        sql3`${transactions.userId} = ${userId} AND ${transactions.type} = 'referral'`
      );
      totalReferralEarnings = Number(totalReferralBonusResult[0].total || 0);
      const hourlyRate = Number(settings?.dailyAirdropAmount || "300.0000") / 24;
      const referralBonusAmount = Number(settings?.referralBonusAmount || "50.0000");
      const referralBonus = activeReferralsCount * referralBonusAmount;
      const response = {
        totalUsers,
        activeAirdropUsers,
        totalMined,
        hourlyAirdropRate: {
          base: hourlyRate,
          referralBonus,
          total: hourlyRate + referralBonus
        },
        totalReferralEarnings,
        activeReferralsCount,
        passiveReferralsCount,
        totalReferralsCount,
        airdrop: {
          dailyAmount: settings?.dailyAirdropAmount || "300.0000",
          weeklyAmount: settings?.weeklyAirdropAmount || "2100.0000",
          cooldownHours: parseFloat(settings?.airdropCooldownHours || "0.0167")
        },
        canClaim,
        nextClaimTime: nextClaimTime?.toISOString() || null,
        lastClaimTime: user.lastAirdropClaim?.toISOString() || null,
        referralBonus: settings?.referralBonusAmount || "50.0000"
      };
      console.log("Airdrop stats response:", response);
      res.json(response);
    } catch (error) {
      console.error("Airdrop stats error:", error);
      res.status(500).json({ message: "Airdrop istatistikleri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      console.log("User stats:", userStats);
      res.json(userStats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "\u0130statistikler al\u0131namad\u0131" });
    }
  });
  app2.get("/api/daily-stats", isAdmin, async (req, res) => {
    try {
      const [userCount] = await db.select({ count: sql3`count(*)` }).from(users);
      const oneDayAgo = /* @__PURE__ */ new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const settingsForActiveUsers = await db.select().from(systemSettings).limit(1);
      const cooldownHoursForActiveUsers = Number(settingsForActiveUsers[0]?.airdropCooldownHours || 24);
      const currentTimeForActiveUsers = /* @__PURE__ */ new Date();
      const [activeUsers] = await db.select({ count: sql3`count(*)` }).from(users).where(
        sql3`${users.lastAirdropClaim} IS NOT NULL AND 
          EXTRACT(EPOCH FROM (${currentTimeForActiveUsers}::timestamp - ${users.lastAirdropClaim}::timestamp))/3600 < ${cooldownHoursForActiveUsers}`
      );
      const [totalAirdropped] = await db.select({
        total: sql3`COALESCE(SUM(${airdropClaims.amount}::decimal), '0')`
      }).from(airdropClaims);
      const [totalReferralBonus] = await db.select({
        total: sql3`COALESCE(SUM(${transactions.amount}::decimal), '0')`
      }).from(transactions).where(eq8(transactions.type, "referral"));
      const airdropByDate = await db.select({
        date: sql3`TO_CHAR(${airdropClaims.createdAt}, 'YYYY-MM-DD')`,
        total: sql3`COALESCE(SUM(${airdropClaims.amount}::decimal), '0')`
      }).from(airdropClaims).groupBy(sql3`TO_CHAR(${airdropClaims.createdAt}, 'YYYY-MM-DD')`).orderBy(sql3`TO_CHAR(${airdropClaims.createdAt}, 'YYYY-MM-DD')`);
      const usersByDate = await db.select({
        date: sql3`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`,
        count: sql3`COUNT(*)`
      }).from(users).groupBy(sql3`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`).orderBy(sql3`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`);
      res.json({
        totalUsers: Number(userCount.count),
        activeUsers: Number(activeUsers?.count || 0),
        totalMined: Number(totalAirdropped?.total || 0),
        totalReferralBonus: Number(totalReferralBonus?.total || 0),
        airdropByDate: airdropByDate.map((item) => ({
          date: item.date,
          amount: Number(item.total)
        })),
        usersByDate: usersByDate.map((item) => ({
          date: item.date,
          count: Number(item.count)
        }))
      });
    } catch (error) {
      console.error("Daily stats error:", error);
      res.status(500).json({ message: "G\xFCnl\xFCk istatistikler al\u0131namad\u0131" });
    }
  });
  app2.get("/api/referral-stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const [user] = await db.select().from(users).where(eq8(users.id, userId));
      let referralCode = user.referralCode;
      if (!referralCode) {
        referralCode = generateReferralCode(user.username);
        await db.update(users).set({ referralCode }).where(eq8(users.id, userId));
      }
      const referrals = await db.select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        lastAirdropClaim: users.lastAirdropClaim
      }).from(users).where(eq8(users.referrerId, userId));
      const referralBonuses = await db.select({
        amount: sql3`SUM(${transactions.amount}::decimal)`
      }).from(transactions).where(sql3`${transactions.type} = 'referral' AND ${transactions.userId} = ${userId}`);
      const totalBonus = Number(referralBonuses[0]?.amount || 0);
      const [settings] = await db.select().from(systemSettings).limit(1);
      const cooldownHours = Number(settings?.airdropCooldownHours || 24);
      console.log("Referans sayfas\u0131 i\xE7in cooldown s\xFCresi:", cooldownHours, "saat");
      const currentTime = /* @__PURE__ */ new Date();
      const activeReferrals = referrals.filter((r) => {
        if (!r.lastAirdropClaim) return false;
        const lastClaimTime = new Date(r.lastAirdropClaim);
        const hoursSinceLastClaim = (currentTime.getTime() - lastClaimTime.getTime()) / (1e3 * 60 * 60);
        return hoursSinceLastClaim < cooldownHours;
      }).length;
      const formattedReferrals = referrals.map((r) => {
        let isActive = false;
        if (r.lastAirdropClaim) {
          const lastClaimTime = new Date(r.lastAirdropClaim);
          const hoursSinceLastClaim = (currentTime.getTime() - lastClaimTime.getTime()) / (1e3 * 60 * 60);
          isActive = hoursSinceLastClaim < cooldownHours;
        }
        return {
          username: r.username,
          joinDate: r.createdAt.toISOString(),
          isActive
        };
      });
      res.json({
        referralCode,
        totalReferrals: referrals.length,
        activeReferrals,
        totalBonus,
        referralBonusRate: settings?.referralBonusRate || "10",
        referrals: formattedReferrals
      });
    } catch (error) {
      console.error("Referral stats error:", error);
      res.status(500).json({ message: "Referans bilgileri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/user-stats", isAdmin, async (req, res) => {
    try {
      const { search } = req.query;
      let query = db.select({
        id: users.id,
        username: users.username,
        balance: users.balance,
        airdropTotal: sql3`COALESCE(
            (SELECT SUM(${airdropClaims.amount}::decimal)
             FROM ${airdropClaims}
             WHERE ${airdropClaims.userId} = ${users.id}),
            '0'
          )`,
        referralCount: sql3`(
            SELECT COUNT(*)
            FROM ${users} as referrals
            WHERE referrals.referrerId = ${users.id}
          )`,
        walletAddress: users.walletAddress,
        kycStatus: users.kycStatus,
        lastAirdropClaim: users.lastAirdropClaim
      }).from(users);
      if (search) {
        query = query.where(sql3`LOWER(${users.username}) LIKE LOWER(${"%" + search + "%"})`);
      }
      const userStats = await query;
      const [settings] = await db.select().from(systemSettings).limit(1);
      const cooldownHours = Number(settings?.airdropCooldownHours || 24);
      console.log("Admin user-stats i\xE7in cooldown s\xFCresi:", cooldownHours, "saat");
      const currentTime = /* @__PURE__ */ new Date();
      const formattedStats = userStats.map((user) => {
        let isActive = false;
        if (user.lastAirdropClaim) {
          const lastClaimTime = new Date(user.lastAirdropClaim);
          const hoursSinceLastClaim = (currentTime.getTime() - lastClaimTime.getTime()) / (1e3 * 60 * 60);
          isActive = hoursSinceLastClaim < cooldownHours;
        }
        return {
          id: user.id,
          username: user.username,
          balance: Number(user.balance),
          airdropTotal: Number(user.airdropTotal),
          referralCount: Number(user.referralCount),
          walletAddress: user.walletAddress,
          kycStatus: user.kycStatus,
          lastAirdropClaim: user.lastAirdropClaim,
          isActive
        };
      });
      res.json(formattedStats);
    } catch (error) {
      log(`User stats error: ${error}`);
      res.status(500).json({ message: "Kullan\u0131c\u0131 istatistikleri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/admin/pages", isAdmin, async (req, res) => {
    try {
      const pageList = await db.select().from(pages).orderBy(desc3(pages.updatedAt));
      res.json(pageList);
    } catch (error) {
      console.error("Pages fetch error:", error);
      res.status(500).json({ message: "Sayfalar al\u0131namad\u0131" });
    }
  });
  app2.get("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const [page] = await db.select().from(pages).where(eq8(pages.id, parseInt(id)));
      if (!page) {
        return res.status(404).json({ message: "Sayfa bulunamad\u0131" });
      }
      const pageCards = await db.select().from(cards).where(eq8(cards.pageId, parseInt(id))).orderBy(asc(cards.order));
      res.json({
        ...page,
        cards: pageCards
      });
    } catch (error) {
      console.error("Page fetch error:", error);
      res.status(500).json({ message: "Sayfa bilgileri al\u0131namad\u0131" });
    }
  });
  app2.post("/api/admin/pages", isAdmin, async (req, res) => {
    try {
      const { title, slug, content, isPublished, showInMenu, menuOrder } = req.body;
      const existingPage = await db.select().from(pages).where(eq8(pages.slug, slug));
      if (existingPage.length > 0) {
        return res.status(400).json({ message: "Bu URL k\u0131saltmas\u0131 (slug) zaten kullan\u0131l\u0131yor" });
      }
      const [newPage] = await db.insert(pages).values({
        title,
        slug,
        content: content || "",
        isPublished: isPublished === true,
        showInMenu: showInMenu === true,
        menuOrder: menuOrder || 0,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      res.status(201).json(newPage);
    } catch (error) {
      console.error("Page creation error:", error);
      res.status(500).json({ message: "Sayfa olu\u015Fturulamad\u0131" });
    }
  });
  app2.put("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, slug, content, isPublished, showInMenu, menuOrder } = req.body;
      const [existingPage] = await db.select().from(pages).where(eq8(pages.id, parseInt(id)));
      if (!existingPage) {
        return res.status(404).json({ message: "Sayfa bulunamad\u0131" });
      }
      if (slug !== existingPage.slug) {
        const slugCheck = await db.select().from(pages).where(eq8(pages.slug, slug));
        if (slugCheck.length > 0) {
          return res.status(400).json({ message: "Bu URL k\u0131saltmas\u0131 (slug) zaten kullan\u0131l\u0131yor" });
        }
      }
      const [updatedPage] = await db.update(pages).set({
        title,
        slug,
        content: content || "",
        isPublished: isPublished === true,
        showInMenu: showInMenu === true,
        menuOrder: menuOrder !== void 0 ? menuOrder : existingPage.menuOrder,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq8(pages.id, parseInt(id))).returning();
      res.json(updatedPage);
    } catch (error) {
      console.error("Page update error:", error);
      res.status(500).json({ message: "Sayfa g\xFCncellenemedi" });
    }
  });
  app2.delete("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(cards).where(eq8(cards.pageId, parseInt(id)));
      await db.delete(pages).where(eq8(pages.id, parseInt(id)));
      res.status(200).json({ message: "Sayfa ba\u015Far\u0131yla silindi" });
    } catch (error) {
      console.error("Page deletion error:", error);
      res.status(500).json({ message: "Sayfa silinemedi" });
    }
  });
  app2.get("/api/admin/pages/:pageId/cards", isAdmin, async (req, res) => {
    try {
      const { pageId } = req.params;
      const cardList = await db.select().from(cards).where(eq8(cards.pageId, parseInt(pageId))).orderBy(asc(cards.order));
      res.json(cardList);
    } catch (error) {
      console.error("Cards fetch error:", error);
      res.status(500).json({ message: "Kartlar al\u0131namad\u0131" });
    }
  });
  app2.post("/api/admin/cards", isAdmin, async (req, res) => {
    try {
      const { pageId, title, content, imageUrl, order, adCode } = req.body;
      const [page] = await db.select().from(pages).where(eq8(pages.id, parseInt(pageId)));
      if (!page) {
        return res.status(404).json({ message: "Sayfa bulunamad\u0131" });
      }
      const [newCard] = await db.insert(cards).values({
        pageId: parseInt(pageId),
        title,
        content: content || "",
        imageUrl: imageUrl || null,
        order: order || 0,
        adCode: adCode || null,
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      res.status(201).json(newCard);
    } catch (error) {
      console.error("Card creation error:", error);
      res.status(500).json({ message: "Kart olu\u015Fturulamad\u0131" });
    }
  });
  app2.put("/api/admin/cards/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, imageUrl, order, adCode } = req.body;
      const [updatedCard] = await db.update(cards).set({
        title,
        content: content || "",
        imageUrl: imageUrl || null,
        order: order || 0,
        adCode: adCode || null
      }).where(eq8(cards.id, parseInt(id))).returning();
      if (!updatedCard) {
        return res.status(404).json({ message: "Kart bulunamad\u0131" });
      }
      res.json(updatedCard);
    } catch (error) {
      console.error("Card update error:", error);
      res.status(500).json({ message: "Kart g\xFCncellenemedi" });
    }
  });
  app2.delete("/api/admin/cards/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(cards).where(eq8(cards.id, parseInt(id)));
      res.status(200).json({ message: "Kart ba\u015Far\u0131yla silindi" });
    } catch (error) {
      console.error("Card deletion error:", error);
      res.status(500).json({ message: "Kart silinemedi" });
    }
  });
  app2.post("/api/admin/cards/reorder", isAdmin, async (req, res) => {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        return res.status(400).json({ message: "Ge\xE7ersiz s\u0131ralama verisi" });
      }
      await Promise.all(orders.map(async (item) => {
        await db.update(cards).set({ order: item.order }).where(eq8(cards.id, item.id));
      }));
      res.status(200).json({ message: "Kartlar yeniden s\u0131raland\u0131" });
    } catch (error) {
      console.error("Card reordering error:", error);
      res.status(500).json({ message: "Kartlar yeniden s\u0131ralanamad\u0131" });
    }
  });
  app2.get("/api/roadmap", async (req, res) => {
    try {
      const roadmapItemsResult = await db.select().from(roadmapItems).where(eq8(roadmapItems.isActive, true)).orderBy(asc(roadmapItems.year), asc(roadmapItems.quarter), asc(roadmapItems.order));
      res.json(roadmapItemsResult);
    } catch (error) {
      console.error("Roadmap fetch error:", error);
      res.status(500).json({ message: "Yol haritas\u0131 verileri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/admin/roadmap", isAdmin, async (req, res) => {
    try {
      const roadmapItemsResult = await db.select().from(roadmapItems).orderBy(asc(roadmapItems.year), asc(roadmapItems.quarter), asc(roadmapItems.order));
      res.json(roadmapItemsResult);
    } catch (error) {
      console.error("Admin roadmap fetch error:", error);
      res.status(500).json({ message: "Yol haritas\u0131 verileri al\u0131namad\u0131" });
    }
  });
  app2.post("/api/admin/roadmap", isAdmin, async (req, res) => {
    try {
      const { title, description, year, quarter, status, order, isActive } = req.body;
      const [newItem] = await db.insert(roadmapItems).values({
        title,
        description,
        year: parseInt(year),
        quarter: parseInt(quarter),
        status: status || "planned",
        order: order !== void 0 ? parseInt(order) : 0,
        isActive: isActive !== void 0 ? isActive : true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Roadmap item creation error:", error);
      res.status(500).json({ message: "Yol haritas\u0131 \xF6\u011Fesi olu\u015Fturulamad\u0131" });
    }
  });
  app2.put("/api/admin/roadmap/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, year, quarter, status, order, isActive } = req.body;
      const [updatedItem] = await db.update(roadmapItems).set({
        title,
        description,
        year: parseInt(year),
        quarter: parseInt(quarter),
        status: status || "planned",
        order: order !== void 0 ? parseInt(order) : 0,
        isActive: isActive !== void 0 ? isActive : true,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq8(roadmapItems.id, parseInt(id))).returning();
      if (!updatedItem) {
        return res.status(404).json({ message: "Yol haritas\u0131 \xF6\u011Fesi bulunamad\u0131" });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error("Roadmap item update error:", error);
      res.status(500).json({ message: "Yol haritas\u0131 \xF6\u011Fesi g\xFCncellenemedi" });
    }
  });
  app2.delete("/api/admin/roadmap/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(roadmapItems).where(eq8(roadmapItems.id, parseInt(id)));
      res.status(200).json({ message: "Yol haritas\u0131 \xF6\u011Fesi ba\u015Far\u0131yla silindi" });
    } catch (error) {
      console.error("Roadmap item deletion error:", error);
      res.status(500).json({ message: "Yol haritas\u0131 \xF6\u011Fesi silinemedi" });
    }
  });
  app2.get("/api/pages", async (req, res) => {
    try {
      const pageList = await db.select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        updatedAt: pages.updatedAt
      }).from(pages).where(eq8(pages.isPublished, true)).orderBy(pages.updatedAt);
      res.json(pageList);
    } catch (error) {
      console.error("Public pages fetch error:", error);
      res.status(500).json({ message: "Sayfalar al\u0131namad\u0131" });
    }
  });
  app2.get("/api/menu", async (req, res) => {
    try {
      console.log("Men\xFC \xF6\u011Feleri isteniyor");
      const menuItems = await db.select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug
      }).from(pages).where(eq8(pages.isPublished, true)).where(eq8(pages.showInMenu, true)).orderBy(asc(pages.menuOrder));
      console.log("Men\xFC \xF6\u011Feleri al\u0131nd\u0131:", menuItems);
      res.json(menuItems);
    } catch (error) {
      console.error("Menu items fetch error:", error);
      res.status(500).json({ message: "Men\xFC \xF6\u011Feleri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/pages/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      console.log("Sayfa detay\u0131 isteniyor:", slug);
      const [page] = await db.select().from(pages).where(eq8(pages.slug, slug)).where(eq8(pages.isPublished, true));
      if (!page) {
        console.log("Sayfa bulunamad\u0131:", slug);
        return res.status(404).json({ message: "Sayfa bulunamad\u0131" });
      }
      console.log("Sayfa bulundu, kartlar getiriliyor:", page.id);
      const pageCards = await db.select().from(cards).where(eq8(cards.pageId, page.id)).orderBy(asc(cards.order));
      const response = {
        ...page,
        cards: pageCards
      };
      console.log("Sayfa detay\u0131 g\xF6nderiliyor:", { id: page.id, cardCount: pageCards.length });
      res.json(response);
    } catch (error) {
      console.error("Public page fetch error:", error);
      res.status(500).json({ message: "Sayfa bilgileri al\u0131namad\u0131", error: String(error) });
    }
  });
  app2.get("/api/image-proxy", async (req, res) => {
    try {
      const imageUrl = req.query.url;
      if (!imageUrl) {
        return res.status(400).send("URL parametresi gereklidir");
      }
      console.log(`Resim proxy iste\u011Fi: ${imageUrl}`);
      const allowedDomains = [
        "resmim.net",
        "hizliresim.com",
        "imgur.com",
        "example.com",
        "images.unsplash.com",
        "i.hizliresim.com"
      ];
      const urlObj = new URL(imageUrl);
      const isDomainAllowed = allowedDomains.some(
        (domain) => urlObj.hostname === domain || urlObj.hostname.endsWith("." + domain)
      );
      if (!isDomainAllowed) {
        console.log(`G\xFCvenlik nedeniyle domain reddedildi: ${urlObj.hostname}`);
        return res.status(403).send("Bu domain i\xE7in resim proxy servisine izin verilmiyor");
      }
      const fetch2 = (await import("node-fetch")).default;
      const response = await fetch2(imageUrl);
      if (!response.ok) {
        return res.status(response.status).send(`Resim al\u0131namad\u0131: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      res.setHeader("Cache-Control", "public, max-age=86400");
      if (response.body) {
        response.body.pipe(res);
      } else {
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error) {
      console.error("Resim proxy hatas\u0131:", error);
      res.status(500).send("Resim proxy i\u015Flemi s\u0131ras\u0131nda bir hata olu\u015Ftu");
    }
  });
  app2.post("/api/update-profile-image", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const { profileImage } = req.body;
      if (!profileImage) {
        return res.status(400).json({ message: "Profil resmi gereklidir" });
      }
      const [updatedUser] = await db.update(users).set({ profileImage }).where(eq8(users.id, userId)).returning();
      if (!updatedUser) {
        return res.status(404).json({ message: "Kullan\u0131c\u0131 bulunamad\u0131" });
      }
      res.status(200).json({
        id: updatedUser.id,
        profileImage: updatedUser.profileImage
      });
    } catch (error) {
      console.error("Profil resmi g\xFCncelleme hatas\u0131:", error);
      res.status(500).json({ message: error.message || "Profil resmi g\xFCncellenirken bir hata olu\u015Ftu" });
    }
  });
  app2.post("/api/update-info", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const { firstName, lastName, email, phoneNumber, birthDate } = req.body;
      const updateData = {};
      if (firstName !== void 0) updateData.firstName = firstName;
      if (lastName !== void 0) updateData.lastName = lastName;
      if (email !== void 0) updateData.email = email;
      if (phoneNumber !== void 0) updateData.phoneNumber = phoneNumber;
      if (birthDate !== void 0) updateData.birthDate = birthDate;
      const [updatedUser] = await db.update(users).set(updateData).where(eq8(users.id, userId)).returning();
      if (!updatedUser) {
        return res.status(404).json({ message: "Kullan\u0131c\u0131 bulunamad\u0131" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Kullan\u0131c\u0131 bilgileri g\xFCncelleme hatas\u0131:", error);
      res.status(500).json({ message: error.message || "Kullan\u0131c\u0131 bilgileri g\xFCncellenirken bir hata olu\u015Ftu" });
    }
  });
  app2.get("/api/tasks", handleGetTasks);
  app2.post("/api/tasks/complete", handleCompleteTask);
  app2.get("/api/admin/tasks", isAdmin, handleAdminGetAllTasks);
  app2.post("/api/admin/tasks", isAdmin, handleCreateTask);
  app2.put("/api/admin/tasks/:id", isAdmin, handleUpdateTask);
  app2.delete("/api/admin/tasks/:id", isAdmin, handleDeleteTask);
  app2.get("/api/admin/task-completions", isAdmin, handleGetTaskCompletions);
  app2.get("/api/faq", handleGetActiveFAQItems);
  app2.get("/api/admin/faq", isAdmin, handleAdminGetAllFAQItems);
  app2.post("/api/admin/faq", isAdmin, handleCreateFAQItem);
  app2.put("/api/admin/faq/:id", isAdmin, handleUpdateFAQItem);
  app2.delete("/api/admin/faq/:id", isAdmin, handleDeleteFAQItem);
  app2.post("/api/admin/faq/reorder", isAdmin, handleChangeFAQItemOrder);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import helmet2 from "helmet";
var app = express2();
app.use(helmet2({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
app.set("trust proxy", 1);
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api") || path3 === "/health") {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  try {
    log2("Starting server initialization...");
    let retries = 5;
    while (retries > 0) {
      try {
        if (await checkDatabaseConnection()) {
          log2("Database connection established successfully");
          break;
        }
        retries--;
        if (retries === 0) {
          throw new Error("Failed to connect to database after multiple retries");
        }
        log2(`Database connection failed, retrying... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      } catch (error) {
        log2(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`);
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      }
    }
    await setupAdminUser();
    log2("Admin user setup completed");
    const server = await registerRoutes(app);
    log2("Routes registered successfully");
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log2(`Error: ${message}`);
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      log2("Setting up Vite development server...");
      await setupVite(app, server);
      log2("Vite development server setup complete");
    } else {
      log2("Setting up static file serving...");
      serveStatic(app);
      log2("Static file serving setup complete");
    }
    server.listen({
      port: 5e3,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log2(`Server is running on http://0.0.0.0:5000`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        log2(`Error: Port 5000 is already in use`);
      } else {
        log2(`Server error: ${error.message}`);
      }
      process.exit(1);
    });
  } catch (error) {
    log2(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();
