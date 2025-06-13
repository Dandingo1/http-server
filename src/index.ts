import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
    errorHandler,
    middlewareLogResponses,
    middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetricsTemplate } from "./api/server-metrics.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import { handlerReset } from "./api/reset.js";
import {
    handlerCreateChirp,
    handlerRetrieveChirp,
    handlerRetrieveChirps,
} from "./api/chirps.js";
import { handlerLogin } from "./api/login.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlerRevoke } from "./api/revoke.js";

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
app.put("/api/users", async (request, response, next) => {
    try {
        await handlerUpdateUser(request, response);
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

app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlerRetrieveChirps(req, res);
    } catch (err) {
        next(err);
    }
});
app.get("/api/chirps/:chirpID", async (req, res, next) => {
    try {
        await handlerRetrieveChirp(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/api/login", async (req, res, next) => {
    try {
        await handlerLogin(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/api/refresh", async (req, res, next) => {
    try {
        await handlerRefresh(req, res);
    } catch (err) {
        next(err);
    }
});
app.post("/api/revoke", async (req, res, next) => {
    try {
        await handlerRevoke(req, res);
    } catch (error) {
        next(error);
    }
});

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

app.use(errorHandler);
