import { Request, Response } from "express";
import { BadRequestError, UnathorizedError } from "../classes/errors.js";
import { login } from "../db/queries/users.js";
import { checkPasswordHash } from "../services/auth.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await login(params.email);
    if (!user) {
        throw new UnathorizedError("Incorrect email or password");
    }

    const isPasswordMatch = await checkPasswordHash(
        params.password,
        user.hashed_password || ""
    );

    if (isPasswordMatch) {
        res.set("Content-Type", "application/json; charset=utf-8");
        res.status(200).send({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        res.end();
    } else {
        throw new UnathorizedError("Incorrect email or password");
    }
}
