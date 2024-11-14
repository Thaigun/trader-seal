import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import type { Database } from './databaseSchema.ts';

const databaseConfig = {
    database: 'ohlcv',
    username: 'postgres',
    password: Deno.env.get('DB_PASSWORD'),
    host: '127.0.0.1',
    port: 5432,
    max: 10,
};

const postgresDriver = postgres(databaseConfig);

export const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
        postgres: postgresDriver,
    }),
});
