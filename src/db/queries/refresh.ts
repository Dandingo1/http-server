import { eq, and, gt, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, refresh_tokens, RefreshToken, users } from "../schema.js";

export async function createToken(
    userId: string,
    token: string
): Promise<RefreshToken> {
    const [result] = await db
        .insert(refresh_tokens)
        .values({
            userId: userId,
            token: token,
            expiresAt: new Date(Date.now() + 5184000),
            revokedAt: null,
        })
        .returning();
    return result;
}

export async function retrieveToken(token: string): Promise<NewUser> {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refresh_tokens, eq(users.id, refresh_tokens.userId))
        .where(
            and(
                eq(refresh_tokens.token, token),
                isNull(refresh_tokens.revokedAt),
                gt(refresh_tokens.expiresAt, new Date())
            )
        )
        .limit(1);
    if (!result) {
        return {} as NewUser;
    }

    return result.user;
}

export async function updateToken(refreshToken: string): Promise<RefreshToken> {
    const [result] = await db
        .update(refresh_tokens)
        .set({ expiresAt: new Date() })
        .where(eq(refresh_tokens.token, refreshToken))
        .returning();
    if (!result) {
        return {} as RefreshToken;
    }
    return result;
}
