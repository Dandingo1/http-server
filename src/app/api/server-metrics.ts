import { Request, Response } from "express";
import { config } from "../../config.js";

export async function handlerMetrics(_: Request, response: Response): Promise<void> { 
    response.send(`Hits: ${config.fileserverHits}`);
    response.end();
}

export async function handlerMetricsTemplate(_: Request, response: Response): Promise<void> { 
    const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
    response.setHeaders(headers);
    response.send(`<html>
    <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
    </body>
    </html>`);
    response.end();
}

export async function handlerReset(_: Request, response: Response): Promise<void> {
    config.fileserverHits = 0;
    response.send(`Reset Hits: ${config.fileserverHits}`);
    response.end();
}