import { Request, Response } from "express";
import { getBearerToken, makeJWT, validateJWT } from "../services/auth.js";
import { retrieveToken } from "../db/queries/refresh.js";
import { UnathorizedError } from "../classes/errors.js";
import { NewUser } from "../db/schema.js";

process.loadEnvFile(".env");

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    let user: NewUser;
    try {
        user = await retrieveToken(refreshToken);
    } catch (error) {
        throw new UnathorizedError("Invalid refresh token");
    }

    const accessToken = makeJWT(user.id || "", 3600, process.env.SECRET || "");

    res.status(200).send({
        token: accessToken,
    });
    res.end();
}
