import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    PaymentRequiredError,
    UnathorizedError,
} from "../classes/errors.js";

export function middlewareLogResponses(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode >= 300) {
            console.log(
                `[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`
            );
        }
    });
    next();
}

export function middlewareMetricsInc(
    _: Request,
    __: Response,
    next: NextFunction
): void {
    config.api.fileserverHits++;
    next();
}

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(err);
    if (err instanceof BadRequestError) {
        res.status(400).send({
            error: err.message,
        });
    } else if (err instanceof UnathorizedError) {
        res.status(401).send({
            error: err.message,
        });
    } else if (err instanceof PaymentRequiredError) {
        res.status(402).send({
            error: err.message,
        });
    } else if (err instanceof ForbiddenError) {
        res.status(403).send({
            error: err.message,
        });
    } else if (err instanceof NotFoundError) {
        res.status(404).send({
            error: err.message,
        });
    }
    next();
}
