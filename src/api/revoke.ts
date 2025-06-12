import { Request, Response } from "express";
import { getBearerToken } from "../services/auth.js";
import { updateToken } from "../db/queries/refresh.js";

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await updateToken(refreshToken);
    res.status(204).send();
    res.end();
}
