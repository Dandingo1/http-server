import { db } from "../index.js";
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
