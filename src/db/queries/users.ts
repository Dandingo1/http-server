import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { chirps, NewUser, users } from "../schema.js";

export async function createUser(user: NewUser): Promise<NewUser> {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function reset(): Promise<void> {
    await db.delete(users);
    await db.delete(chirps);
}

export async function retrieveUser(email: string): Promise<NewUser> {
    const result = await db.select().from(users).where(eq(users.email, email));
    if (result.length === 0) {
        return {} as NewUser;
    }
    return result[0];
}

export async function updateUser(
    email: string,
    password: string,
    userId: string
): Promise<NewUser> {
    const result = await db
        .update(users)
        .set({ email: email, hashed_password: password })
        .where(eq(users.id, userId))
        .returning();
    if (!result) {
        return {} as NewUser;
    }
    return result[0];
}

export async function retrieveUsers(): Promise<NewUser[]> {
    const result = await db.select().from(users);
    return result;
}
