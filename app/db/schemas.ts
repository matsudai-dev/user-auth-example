import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Helper function to define a timestamp column */
const timestamp = (name: string) => integer(name, { mode: "timestamp" });

/** Helper function to get the current Unix epoch time */
const now = () => sql`(unixepoch())`;

/** `users` table schema definition */
export const usersTable = sqliteTable("users", {
	/** UUIDv7 */
	id: text("id").primaryKey(),
	/** User's email address */
	email: text("email").notNull().unique(),
	/** Salt used for password hashing */
	salt: text("salt"),
	/** Hashed password */
	passwordHash: text("password_hash"),
	/** Google account ID (unique identifier from Google OAuth) */
	googleId: text("google_id").unique(),
	/** Timestamp of user creation */
	createdAt: timestamp("created_at").notNull().default(now()),
});

/** `signup_sessions` table schema definition */
export const signupSessionsTable = sqliteTable("signup_sessions", {
	/** UUIDv7 */
	id: text("id").primaryKey(),
	/** Email address for signup */
	email: text("email").notNull(),
	/** SHA-256 hash of the verification token */
	tokenHash: text("token_hash").notNull().unique(),
	/** Expiration timestamp */
	expiresAt: timestamp("expires_at").notNull(),
});

/** `login_rate_limits` table schema definition */
export const loginRateLimitsTable = sqliteTable("login_rate_limits", {
	/** Email address (primary key) */
	email: text("email").primaryKey(),
	/** Number of failed login attempts */
	failedAttempts: integer("failed_attempts").notNull().default(0),
	/** Timestamp until the account is locked */
	lockedUntil: timestamp("locked_until"),
	/** Expiration timestamp for this rate limit record */
	expiresAt: timestamp("expires_at").notNull(),
});

/** `login_sessions` table schema definition */
export const loginSessionsTable = sqliteTable("login_sessions", {
	/** UUIDv7 */
	id: text("id").primaryKey(),
	/** User ID (foreign key to users table) */
	userId: text("user_id").notNull(),
	/** SHA-256 hash of the refresh token */
	refreshTokenHash: text("refresh_token_hash").notNull().unique(),
	/** Client user agent string */
	userAgent: text("user_agent"),
	/** Timestamp of session creation */
	createdAt: timestamp("created_at").notNull().default(now()),
	/** Timestamp of last access */
	lastAccessedAt: timestamp("last_accessed_at").notNull().default(now()),
	/** Expiration timestamp */
	expiresAt: timestamp("expires_at").notNull(),
});

/** `temporary_sessions` table schema definition (for rememberMe=false) */
export const temporarySessionsTable = sqliteTable("temporary_sessions", {
	/** UUIDv7 */
	id: text("id").primaryKey(),
	/** User ID (foreign key to users table) */
	userId: text("user_id").notNull(),
	/** SHA-256 hash of the session token */
	sessionTokenHash: text("session_token_hash").notNull().unique(),
	/** Client user agent string */
	userAgent: text("user_agent"),
	/** Timestamp of session creation */
	createdAt: timestamp("created_at").notNull().default(now()),
	/** Timestamp of last access (for cleanup purposes) */
	lastAccessedAt: timestamp("last_accessed_at").notNull().default(now()),
});

/** `password_reset_sessions` table schema definition */
export const passwordResetSessionsTable = sqliteTable(
	"password_reset_sessions",
	{
		/** UUIDv7 */
		id: text("id").primaryKey(),
		/** Email address for password reset */
		email: text("email").notNull(),
		/** SHA-256 hash of the reset token */
		tokenHash: text("token_hash").notNull().unique(),
		/** Expiration timestamp */
		expiresAt: timestamp("expires_at").notNull(),
	},
);
