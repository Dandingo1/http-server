import { Request, Response } from "express";
import {
    createChirp,
    deleteChirp,
    getChirp,
    getChirps,
    getChirpsByAuthorId,
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

export async function handlerRetrieveChirps(
    req: Request,
    res: Response
): Promise<void> {
    const authorId = req.query.authorId;
    if (typeof authorId === "string") {
        const chirps = await getChirpsByAuthorId(authorId);
        res.status(200).send(chirps);
    } else {
        const chirps = await getChirps();
        res.set("Content-Type", "application/json; charset=utf-8");
        res.status(200).send(chirps);
    }
}

export async function handlerRetrieveChirp(
    req: Request,
    res: Response
): Promise<void> {
    const { chirpId } = req.params;
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(chirp);
    res.end();
}

export async function handlerDeleteChirp(
    req: Request,
    res: Response
): Promise<void> {
    const { chirpId } = req.params;
    if (!chirpId) {
        throw new BadRequestError("Missing chirp Id");
    }

    const accessToken = getBearerToken(req);
    const userId = validateJWT(accessToken, process.env.SECRET || "");

    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp was not found with the chirp Id");
    }

    if (userId !== chirp.userId) {
        throw new ForbiddenError("User does not have permission");
    }

    const deletedChirp = await deleteChirp(chirpId);
    if (!deletedChirp) {
        throw new NotFoundError("Chirp cannot be found ");
    }

    res.status(204);
    res.end();
}
