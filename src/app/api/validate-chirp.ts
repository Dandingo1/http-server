import { Request, Response } from "express";
import { BadRequestError } from "../classes/errors.js";

export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    const PROFANE_WORDS = new Set(["kerfuffle", "sharbert", "fornax"]);
    type parameters = {
        body: string;
    }
    const MAX_CHIRP_LENGTH = 140;


    // Possible trie solution
    
    
    // let body = "";
    // req.on("data", (chunk) => {
    //     body += chunk;
    // }) 

    
    // req.on("end", () => {
    let params: parameters = req.body;
    // try {
    //     params = req.body;
    // } catch (err) {
    //     res.status(400).send({
    //         error: "Invalid JSON"
    //     })
    // }
    if (params.body.length >= MAX_CHIRP_LENGTH) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    } else {
        let cleanedBody = "";
        const words_split = params.body.split(" ");
        for (let word of words_split) {
            if (PROFANE_WORDS.has(word.toLowerCase())) {
                cleanedBody += "****"
            } else {
                cleanedBody += word;
            }
            cleanedBody += " ";
        }
        cleanedBody = cleanedBody.trim();
4
        res.status(200).send({
            "cleanedBody": cleanedBody,
        })
    }
}