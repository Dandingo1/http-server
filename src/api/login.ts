import { Request, Response } from "express";
import { BadRequestError, UnathorizedError } from "../classes/errors.js";
import { login } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../services/auth.js";

process.loadEnvFile(".env");

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresInSeconds?: number;
    };

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    if (!params.expiresInSeconds || params.expiresInSeconds > 3600) {
        params.expiresInSeconds = 3600;
    }

    const user = await login(params.email);
    if (!user) {
        throw new UnathorizedError("Incorrect email or password");
    }

    const isPasswordMatch = await checkPasswordHash(
        params.password,
        user.hashed_password || ""
    );

    const token = makeJWT(
        user.id || "",
        params.expiresInSeconds,
        process.env.SECRET || ""
    );

    if (isPasswordMatch) {
        res.set("Content-Type", "application/json; charset=utf-8");
        res.status(200).send({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token,
        });
        res.end();
    } else {
        throw new UnathorizedError("Incorrect email or password");
    }
}
