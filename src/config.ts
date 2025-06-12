import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile(".env");

type Config = {
    api: APIConfig;
    db: DBConfig;
    secret: string;
};

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(process.env.PORT) || 0,
        platform: process.env.PLATFORM || "",
    },
    db: {
        url: process.env.DB_URL || "",
        migrationConfig: migrationConfig,
    },
    secret: process.env.SECRET || "",
};
