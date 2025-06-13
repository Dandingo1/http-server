import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "crypto";
import { UnathorizedError } from "../classes/errors.js";

const ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

export async function checkPasswordHash(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
    userId: string,
    expiresIn: number,
    secret: string
): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiredAt = issuedAt + expiresIn;
    const payload: payload = {
        iss: ISSUER,
        sub: userId,
        iat: issuedAt,
        exp: expiredAt,
    };
    return jwt.sign(payload, secret, { algorithm: "HS256" });
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new UnathorizedError("Invalid access token");
    }

    if (!decoded.sub) {
        throw new UnathorizedError("No user Id exists");
    }

    return decoded.sub;
}

export function getBearerToken(req: Request): string {
    const token = req.get("Authorization")?.split(" ")[1].trim();
    if (!token) {
        throw new UnathorizedError("Missing access token");
    }
    return token;
}

export function makeRefreshToken(): string {
    return randomBytes(32).toString("hex");
}
