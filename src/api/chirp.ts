import { Request, Response } from "express";
import { createChirp } from "../db/queries/chirps.js";
import { handlerValidateChirp } from "./validate-chirp.js";

export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    const validatedChirp = await handlerValidateChirp(req, res);

    const chirp = await createChirp({
        body: validatedChirp,
        userId: params.userId,
    });

    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(201).send({
        id: chirp.id,
        body: chirp.body,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        userId: chirp.userId,
    });
    res.end();
}
