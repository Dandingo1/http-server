import { Request, Response } from "express";
import { BadRequestError, UnathorizedError } from "../classes/errors.js";
import { retrieveUser } from "../db/queries/users.js";
import {
    checkPasswordHash,
    makeJWT,
    makeRefreshToken,
} from "../services/auth.js";
import { createToken } from "../db/queries/refresh.js";

process.loadEnvFile(".env");

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await retrieveUser(params.email);
    if (!user) {
        throw new UnathorizedError("Incorrect email or password");
    }

    const isPasswordMatch = await checkPasswordHash(
        params.password,
        user.hashed_password || ""
    );

    if (!isPasswordMatch) {
        throw new UnathorizedError("Incorrect email or password");
    }

    const accessToken = makeJWT(user.id || "", 3600, process.env.SECRET || "");
    const refreshToken = makeRefreshToken();
    console.log(refreshToken);
    console.log(refreshToken.length);

    const isTokenSaved = await createToken(user.id || "", refreshToken);
    if (!isTokenSaved) {
        throw new UnathorizedError("Could not save refresh token");
    }

    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(200).send({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken,
        refreshToken: refreshToken,
    });
    res.end();
}
