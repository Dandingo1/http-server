import { Request, Response } from "express";
import { BadRequestError } from "../classes/errors.js";
type parameters = {
    body: string;
};

const PROFANE_WORDS = new Set(["kerfuffle", "sharbert", "fornax"]);
const MAX_CHIRP_LENGTH = 140;

export async function handlerValidateChirp(
    req: Request,
    _: Response
): Promise<string> {
    let params: parameters = req.body;

    if (params.body.length >= MAX_CHIRP_LENGTH) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    } else {
        let cleanedBody = "";
        const words_split = params.body.split(" ");
        for (let word of words_split) {
            if (PROFANE_WORDS.has(word.toLowerCase())) {
                cleanedBody += "****";
            } else {
                cleanedBody += word;
            }
            cleanedBody += " ";
        }
        cleanedBody = cleanedBody.trim();

        return cleanedBody;
    }
}
