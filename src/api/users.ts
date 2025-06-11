import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../classes/errors.js";

export async function handlerCreateUser(
    req: Request,
    res: Response
): Promise<void> {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;
    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await createUser({
        email: params.email,
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
