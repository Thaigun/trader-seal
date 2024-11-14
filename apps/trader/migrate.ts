import * as path from 'jsr:@std/path';
import { type Migration, type MigrationProvider, type MigrationResultSet, Migrator } from 'kysely';
import { db } from './db.ts';

interface FileMigrationProviderProps {
    migrationDir: string;
}

class DenoMigrationProvider implements MigrationProvider {
    constructor(private props: FileMigrationProviderProps) {}

    async getMigrations(): Promise<Record<string, Migration>> {
        const files: Deno.DirEntry[] = [];
        for await (const f of Deno.readDir(this.props.migrationDir)) {
            if (f.isFile) files.push(f);
        }

        const migrations: Record<string, Migration> = {};

        for (const f of files) {
            const filePath = `./${path.join(this.props.migrationDir, f.name)}`;
            const migration = await import(filePath);
            migrations[f.name.slice(0, -3)] = migration;
        }

        return migrations;
    }
}

const currentDir = import.meta.dirname;
if (!currentDir) {
    throw new Error('import.meta.dirname is not defined');
}

const command = Deno.args[0];
if (Deno.args.length !== 1 || !['latest', 'up', 'down'].includes(command)) {
    console.error('Usage: migrate.ts latest|up|down');
    Deno.exit(1);
}

const migrator = new Migrator({
    db,
    provider: new DenoMigrationProvider({
        migrationDir: './migrations',
    }),
});

let migrationResultSet: MigrationResultSet;
switch (command) {
    case 'latest':
        migrationResultSet = await migrator.migrateToLatest();
        break;
    case 'up':
        migrationResultSet = await migrator.migrateUp();
        break;
    case 'down':
        migrationResultSet = await migrator.migrateDown();
        break;
    default:
        throw new Error(`Unknown command: ${command}`);
}
const { results, error } = migrationResultSet;

for (const result of results ?? []) {
    if (result.status === 'Success') {
        console.log(`Migration ${result.migrationName} was successful`);
    } else if (result.status === 'Error') {
        console.error(`Migration ${result.migrationName} failed`);
    }
}

if (error) {
    console.error('Migration failed');
    console.error(error);
}

await db.destroy();
