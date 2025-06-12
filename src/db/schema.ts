import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashed_password: varchar().notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar({ length: 140 }).notNull(),
    userId: uuid("user_Id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
});

export type NewChirp = typeof chirps.$inferInsert;

export const refresh_tokens = pgTable("refresh_tokens", {
    token: varchar("token", { length: 256 }).primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
});

export type RefreshToken = typeof refresh_tokens.$inferInsert;
