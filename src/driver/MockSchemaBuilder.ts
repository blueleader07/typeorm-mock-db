import { Connection, getMetadataArgsStorage } from 'typeorm'
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage'
import { SchemaBuilder } from 'typeorm/schema-builder/SchemaBuilder'
import { SqlInMemory } from 'typeorm/driver/SqlInMemory'

export const metadataArgsStorage: MetadataArgsStorage = getMetadataArgsStorage()

/**
 * Creates complete tables schemas in the database based on the entity metadatas.
 *
 * Steps how schema is being built:
 * 1. load list of all tables with complete column and keys information from the db
 * 2. drop all (old) foreign keys that exist in the table, but does not exist in the metadata
 * 3. create new tables that does not exist in the db, but exist in the metadata
 * 4. drop all columns exist (left old) in the db table, but does not exist in the metadata
 * 5. add columns from metadata which does not exist in the table
 * 6. update all exist columns which metadata has changed
 * 7. update primary keys - update old and create new primary key from changed columns
 * 8. create foreign keys which does not exist in the table yet
 * 9. create indices which are missing in db yet, and drops indices which exist in the db, but does not exist in the metadata anymore
 */
export class MockSchemaBuilder implements SchemaBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor (protected connection: Connection) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates complete schemas for the given entity metadatas.
     */
    async build (): Promise<void> {
        return Promise.resolve()
    }

    /**
     * Returns query to be executed by schema builder.
     */
    log (): Promise<SqlInMemory> {
        return Promise.resolve(new SqlInMemory())
    }
}
