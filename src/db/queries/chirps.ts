import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp): Promise<NewChirp> {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getChirps(): Promise<NewChirp[]> {
    const result = await db.select().from(chirps).orderBy(chirps.createdAt);
    return result;
}

export async function getChirpsByAuthorId(
    authorId: string
): Promise<NewChirp[]> {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, authorId));
    if (!result) {
        return [] as NewChirp[];
    }

    return result;
}

export async function getChirp(id: string): Promise<NewChirp> {
    const result = await db.select().from(chirps).where(eq(chirps.id, id));
    if (!result) {
        return {} as NewChirp;
    }
    return result[0];
}

export async function deleteChirp(id: string): Promise<NewChirp> {
    const result = await db.delete(chirps).where(eq(chirps.id, id)).returning();
    if (!result) {
        return {} as NewChirp;
    }
    return result[0];
}
