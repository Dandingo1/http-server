import { Request, Response } from "express";
import {
    createChirp,
    deleteChirp,
    getChirp,
    getChirps,
} from "../db/queries/chirps.js";
import { handlerValidateChirp } from "../services/validate-chirp.js";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnathorizedError,
} from "../classes/errors.js";
import { getBearerToken, validateJWT } from "../services/auth.js";

process.loadEnvFile(".env");

export async function handlerCreateChirp(req: Request, res: Response) {
    const token = getBearerToken(req);
    let userId = "";
    try {
        userId = validateJWT(token, process.env.SECRET || "");
    } catch (err) {
        throw new UnathorizedError("Unauthorized access");
    }

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

export async function handlerDeleteChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
    if (!chirpId) {
        throw new BadRequestError("Missing chirp Id ");
    }

    const accessToken = getBearerToken(req);
    if (!accessToken) {
        throw new BadRequestError("Missing bearer token");
    }

    const userId = validateJWT(accessToken, process.env.SECRET || "");
    const authorId = (await getChirp(chirpId)).userId;
    console.log(userId);
    console.log(authorId);
    if (userId !== authorId) {
        throw new ForbiddenError("User does not have permission");
    }

    const chirp = await deleteChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp cannot be found ");
    }

    res.status(204);
    res.end();
}
