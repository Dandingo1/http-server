import { config } from "../config.js";
import { Response, Request } from "express";
import { reset } from "../db/queries/users.js";
import { UnathorizedError } from "../classes/errors.js";

export async function handlerReset(
    _: Request,
    response: Response
): Promise<void> {
    if (config.api.platform !== "dev") {
        console.log(config.api.platform);
        throw new UnathorizedError("Reset is only allowed in dev environment.");
    }
    await reset();
    config.api.fileserverHits = 0;
    response.send(`Reset Hits: ${config.api.fileserverHits}`);
    response.end();
}
