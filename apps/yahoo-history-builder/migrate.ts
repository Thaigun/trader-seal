import * as path from 'jsr:@std/path';
import { type Migration, type MigrationProvider, Migrator } from 'kysely';
import { db } from './db.ts';

const currentDir = import.meta.dirname;
if (!currentDir) {
    throw new Error('import.meta.dirname is not defined');
}

interface FileMigrationProviderProps {
    migrationDir: string;
  }  

  class DenoMigrationProvider implements MigrationProvider {
  
    constructor(private props: FileMigrationProviderProps) {}
  
    async getMigrations(): Promise<Record<string, Migration>> {
      const files: Deno.DirEntry[] = [];
      for await (const f of Deno.readDir(this.props.migrationDir)) {
        if (f.isFile) { files.push(f); }
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

const migrator = new Migrator({
    db,
    provider: new DenoMigrationProvider({
        migrationDir: './migrations',
    })
})

const {error, results} = await migrator.migrateToLatest();

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
