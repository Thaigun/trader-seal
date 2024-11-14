import { Client } from 'https://deno.land/x/postgres/mod.ts';
import { DummyDriver, Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';
import type { Database } from './databaseSchema.ts';
import {PostgresJSDialect} from 'kysely-postgres-js';
import postgres from 'postgres';

export const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
        postgres: postgres({
            database: 'ohlcv',
            username: 'postgres',
            password: Deno.env.get('DB_PASSWORD'),
            host: '127.0.0.1',
            port: 5432,
            max: 10,
        })
    }),
});

// export const client = new Client({
//     user: 'postgres',
//     database: 'ohlcv',
//     hostname: 'localhost',
//     port: 5432,
//     password: Deno.env.get('DB_PASSWORD'),
// });