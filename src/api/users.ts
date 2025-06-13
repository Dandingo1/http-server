import type { Request, Response } from "express";
import { createUser, updateUser, upgradeUser } from "../db/queries/users.js";
import { BadRequestError, NotFoundError } from "../classes/errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../services/auth.js";

process.loadEnvFile(".env");

export async function handlerCreateUser(
    req: Request,
    res: Response
): Promise<void> {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({
        email: params.email,
        hashed_password: hashedPassword,
    });
    if (!user) {
        throw new Error("Could not create user");
    }

    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(201).send({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.is_chirpy_red,
    });
    res.end();
}

export async function handlerUpdateUser(
    request: Request,
    response: Response
): Promise<void> {
    type parameters = {
        email: string;
        password: string;
    };

    const accessToken = getBearerToken(request);
    const userId = validateJWT(accessToken, process.env.SECRET || "");

    const params: parameters = request.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);
    const user = await updateUser(params.email, hashedPassword, userId);

    response.status(200).send({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.is_chirpy_red,
    });
}

export async function handlerUpgradeUser(
    req: Request,
    res: Response
): Promise<void> {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204);
        res.end();
    }

    const upgradedUser = await upgradeUser(params.data.userId);
    if (!upgradedUser) {
        throw new NotFoundError("User cannot be found");
    }

    res.status(204).send();
    res.end();
}
