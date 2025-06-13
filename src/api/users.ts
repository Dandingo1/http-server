import type { Request, Response } from "express";
import { createUser, retrieveUsers, updateUser } from "../db/queries/users.js";
import { BadRequestError, UnathorizedError } from "../classes/errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../services/auth.js";
import { retrieveToken } from "../db/queries/refresh.js";

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

    // const currentUser = await retrieveToken(accessToken);
    // if (!currentUser) {
    //     throw new UnathorizedError("User does not exist");
    // }

    const user = await updateUser(params.email, hashedPassword, userId);
    // if (!user) {
    //     throw new UnathorizedError("User was not updated");
    // }

    response.status(200).send({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
