import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const passowrd2 = "anotherPassword456!";

    let hash1: string;
    let hash2: string;

    const userId = "mockUser";
    const expiresIn = 1000;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(passowrd2);
    });

    it("will return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("will create a JWT and validate the JWT against the user's secret", async () => {
        const token = makeJWT(userId, expiresIn, hash1);
        const result = validateJWT(token, hash1);
        expect(result).toBe(userId);
    });

    it("will reject tokens that are expired", async () => {
        const token = makeJWT(userId, -1, hash1);
        try {
            validateJWT(token, hash1);
        } catch (error) {
            expect(error).toStrictEqual(
                new Error("Invalid token or token has expired")
            );
        }
    });

    it("will reject if the secret does not match", async () => {
        const token = makeJWT(userId, expiresIn, hash1);
        try {
            validateJWT(token, hash2);
        } catch (error) {
            expect(error).toStrictEqual(
                new Error("Invalid token or token has expired")
            );
        }
    });
});
