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
