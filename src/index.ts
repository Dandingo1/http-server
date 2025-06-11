import express, {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
    errorHandler,
    middlewareLogResponses,
    middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetricsTemplate } from "./api/server-metrics.js";
import { handlerValidateChirp } from "./api/validate-chirp.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/users.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateChirp } from "./api/chirp.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    } catch (err) {
        next(err);
    }
});
app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerMetricsTemplate(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/api/users", async (req, res, next) => {
    try {
        await handlerCreateUser(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerCreateChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

app.use(errorHandler);
