import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import type { Database } from './databaseSchema.ts';

export function createConnection(params: {
    database: string;
    username: string;
    host: string;
    port: number;
    password?: string;
    max?: number;
}): Kysely<Database> {    
    const postgresDriver = postgres(params);
    
    const db = new Kysely<Database>({
        dialect: new PostgresJSDialect({
            postgres: postgresDriver,
        }),
    });

    return db;
}
