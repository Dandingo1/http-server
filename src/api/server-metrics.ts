import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerMetrics(
    _: Request,
    response: Response
): Promise<void> {
    response.send(`Hits: ${config.api.fileserverHits}`);
    response.end();
}

export async function handlerMetricsTemplate(
    _: Request,
    response: Response
): Promise<void> {
    const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
    response.setHeaders(headers);
    response.send(`<html>
    <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
    </body>
    </html>`);
    response.end();
}
