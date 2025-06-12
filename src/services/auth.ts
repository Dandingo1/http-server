import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    const payload: payload = {
        iss: "chirpy",
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const { sub } = jwt.verify(tokenString, secret) as JwtPayload;
        return sub || "";
    } catch (err) {
        throw new Error("Invalid token or token has expired");
    }
}
