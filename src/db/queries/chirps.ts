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
