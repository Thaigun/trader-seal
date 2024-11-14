import type { Kysely } from 'kysely';

// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('assets')
        .addColumn('symbol', 'text', (col) => col.primaryKey())
        .addColumn('class', 'text')
        .addColumn('exchange', 'text')
        .addColumn('name', 'text')
        .addColumn('status', 'text')
        .addColumn('tradable', 'boolean')
        .addColumn('marginable', 'boolean')
        .addColumn('maintenance_margin_requirement', 'numeric')
        .addColumn('margin_requirement_long', 'text')
        .addColumn('margin_requirement_short', 'text')
        .addColumn('shortable', 'boolean')
        .addColumn('easy_to_borrow', 'boolean')
        .addColumn('fractionable', 'boolean')
        .addColumn('attributes', 'text')
        .execute();

    await db.schema
        .createTable('daily_prices')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('symbol', 'text')
        .addColumn('timestamp', 'timestamp(3)')
        .addColumn('open', 'numeric')
        .addColumn('high', 'numeric')
        .addColumn('low', 'numeric')
        .addColumn('close', 'numeric')
        .addColumn('volume', 'numeric')
        .addColumn('adjusted_close', 'numeric')
        .execute();

    await db.schema
        .createTable('events')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('symbol', 'text')
        .addColumn('event_type', 'text')
        .addColumn('timestamp', 'timestamp(3)')
        .addColumn('value', 'numeric')
        .execute();
}

// deno-lint-ignore no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('events').execute();
    await db.schema.dropTable('daily_prices').execute();
    await db.schema.dropTable('assets').execute();
}
