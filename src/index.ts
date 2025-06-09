import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handlerReadiness } from "./app/api/readiness.js";
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from "./app/api/middleware.js"
import { handlerMetricsTemplate, handlerReset } from "./app/api/server-metrics.js";
import { handlerValidateChirp } from "./app/api/validate-chirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"))

app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res)
    } catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerMetricsTemplate(req, res)
    } catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res)
    } catch (err) {
        next(err);
    }
});
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res)
    } catch (err) {
        next(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(errorHandler);