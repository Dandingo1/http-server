import { Request, Response } from "express";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { handlerValidateChirp } from "../services/validate-chirp.js";
import { NotFoundError } from "../classes/errors.js";
import { getBearerToken, validateJWT } from "../services/auth.js";

process.loadEnvFile(".env");

export async function handlerCreateChirp(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, process.env.SECRET || "");

    const validatedChirp = await handlerValidateChirp(req, res);

    const chirp = await createChirp({
        body: validatedChirp,
        userId: userId,
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

export async function handlerRetrieveChirps(_: Request, res: Response) {
    const chirps = await getChirps();
    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(chirps);
    res.end();
}

export async function handlerRetrieveChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(chirp);
    res.end();
}
