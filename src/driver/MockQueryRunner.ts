import { View } from 'typeorm/schema-builder/view/View'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import { SqlInMemory } from 'typeorm/driver/SqlInMemory'
import { Broadcaster } from 'typeorm/subscriber/Broadcaster'
import {
    QueryRunner,
    ObjectLiteral,
    TableColumn,
    Table,
    TableForeignKey,
    TableIndex,
    TableUnique,
    TypeORMError,
    ReplicationMode,
    TableExclusion,
    TableCheck, EntityManager
} from 'typeorm'
import { DataSource } from 'typeorm/data-source'

class DeleteManyOptions {
    maxConcurrency: number
}

class PutManyOptions {
    maxConcurrency: number
}

export class MockQueryRunner implements QueryRunner {
    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Connection used by this query runner.
     */
    connection: DataSource

    /**
     * Entity manager working only with current query runner.
     */
    manager: EntityManager

    /**
     * Mock does not require to dynamically create query runner each time,
     * because it does not have a regular connection pool as RDBMS systems have.
     */
    queryRunner?: MockQueryRunner

    /**
     * Indicates if connection for this query runner is released.
     * Once its released, query runner cannot run queries anymore.
     * Always false for Mock since Mock has a single query executor instance.
     */
    isReleased = false

    /**
     * Indicates if transaction is active in this query executor.
     * Always false for Mock since Mock does not support transactions.
     */
    isTransactionActive = false

    /**
     * Stores temporarily user data.
     * Useful for sharing data with subscribers.
     */
    data = {}

    /**
     * All synchronized tables in the database.
     */
    loadedTables: Table[]

    /**
     * All synchronized views in the database.
     */
    loadedViews: any[]

    /**
     * Real database connection from a connection pool used to perform queries.
     */
    databaseConnection: undefined

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor (connection: DataSource, databaseConnection: any) {
        this.connection = connection
        this.databaseConnection = databaseConnection
        this.broadcaster = new Broadcaster(this)
    }

    /**
     * Broadcaster used on this query runner to broadcast entity events.
     */
    broadcaster: Broadcaster

    async clearDatabase (database?: string): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    stream (
        query: string,
        parameters?: any[],
        onEnd?: Function,
        onError?: Function
    ): Promise<ReadStream> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    getView (viewPath: string): Promise<View | undefined> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    getViews (viewPaths?: string[]): Promise<View[]> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Delete multiple documents on Mock.
     */
    async deleteMany (
        tableName: string,
        keys: ObjectLiteral[],
        options?: DeleteManyOptions
    ): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Delete a document on Mock.
     */
    async deleteOne (tableName: string, key: ObjectLiteral): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Inserts an array of documents into Mock.
     */
    async putMany (
        tableName: string,
        docs: ObjectLiteral[],
        options?: PutManyOptions
    ): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Inserts a single document into Mock.
     */
    async putOne (
        tableName: string,
        doc: ObjectLiteral
    ): Promise<ObjectLiteral> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * For Mock database we don't create connection, because its single connection already created by a driver.
     */
    async connect (): Promise<any> {}

    /**
     * For Mock database we don't release connection, because its single connection.
     */
    async release (): Promise<void> {
        // releasing connection are not supported by Mock driver, so simply don't do anything here
    }

    /**
     * Starts transaction.
     */
    async startTransaction (): Promise<void> {
        // transactions are not supported by Mock driver, so simply don't do anything here
    }

    /**
     * Commits transaction.
     */
    async commitTransaction (): Promise<void> {
        // transactions are not supported by Mock driver, so simply don't do anything here
    }

    /**
     * Rollbacks transaction.
     */
    async rollbackTransaction (): Promise<void> {
        // transactions are not supported by Mock driver, so simply don't do anything here
    }

    /**
     * Executes a given SQL query.
     */
    query (query: string, parameters?: any[]): Promise<any> {
        throw new TypeORMError(
            'Executing SQL query is not supported by Mock driver.'
        )
    }

    /**
     * Returns raw data stream.
     */
    // stream (query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream> {
    //     throw new TypeORMError('Stream is not supported yet. Use watch instead.')
    // }

    /**
     * Returns all available database names including system databases.
     */
    async getDatabases (): Promise<string[]> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     */
    async getSchemas (database?: string): Promise<string[]> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Loads given table's data from the database.
     */
    async getTable (collectionName: string): Promise<Table | undefined> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    async getTables (collectionNames: string[]): Promise<Table[]> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Checks if database with the given name exist.
     */
    async hasDatabase (database: string): Promise<boolean> {
        throw new TypeORMError(
            'Check database queries are not supported by Mock driver.'
        )
    }

    /**
     * Loads currently using database
     */
    async getCurrentDatabase (): Promise<undefined> {
        throw new TypeORMError(
            'Check database queries are not supported by Mock driver.'
        )
    }

    /**
     * Checks if schema with the given name exist.
     */
    async hasSchema (schema: string): Promise<boolean> {
        throw new TypeORMError(
            'Check schema queries are not supported by Mock driver.'
        )
    }

    /**
     * Loads currently using database schema
     */
    async getCurrentSchema (): Promise<undefined> {
        throw new TypeORMError(
            'Check schema queries are not supported by Mock driver.'
        )
    }

    /**
     * Checks if table with the given name exist in the database.
     */
    async hasTable (collectionName: string): Promise<boolean> {
        throw new TypeORMError(
            'Check schema queries are not supported by Mock driver.'
        )
    }

    /**
     * Checks if column with the given name exist in the given table.
     */
    async hasColumn (
        tableOrName: Table | string,
        columnName: string
    ): Promise<boolean> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a database if it's not created.
     */
    async createDatabase (database: string): Promise<void> {
        throw new TypeORMError(
            'Database create queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops database.
     */
    async dropDatabase (database: string, ifExist?: boolean): Promise<void> {
        throw new TypeORMError(
            'Database drop queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new table schema.
     */
    async createSchema (
        schemaPath: string,
        ifNotExist?: boolean
    ): Promise<void> {
        throw new TypeORMError(
            'Schema create queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops table schema.
     */
    async dropSchema (schemaPath: string, ifExist?: boolean): Promise<void> {
        throw new TypeORMError(
            'Schema drop queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new table from the given table and columns inside it.
     */
    async createTable (table: Table): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops the table.
     */
    async dropTable (tableName: Table | string): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new view.
     */
    async createView (view: View): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops the view.
     */
    async dropView (target: View | string): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Renames the given table.
     */
    async renameTable (
        oldTableOrName: Table | string,
        newTableOrName: Table | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new column from the column in the table.
     */
    async addColumn (
        tableOrName: Table | string,
        column: TableColumn
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new columns from the column in the table.
     */
    async addColumns (
        tableOrName: Table | string,
        columns: TableColumn[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Renames column in the given table.
     */
    async renameColumn (
        tableOrName: Table | string,
        oldTableColumnOrName: TableColumn | string,
        newTableColumnOrName: TableColumn | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Changes a column in the table.
     */
    async changeColumn (
        tableOrName: Table | string,
        oldTableColumnOrName: TableColumn | string,
        newColumn: TableColumn
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Changes a column in the table.
     */
    async changeColumns (
        tableOrName: Table | string,
        changedColumns: { newColumn: TableColumn; oldColumn: TableColumn }[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops column in the table.
     */
    async dropColumn (
        tableOrName: Table | string,
        columnOrName: TableColumn | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops the columns in the table.
     */
    async dropColumns (
        tableOrName: Table | string,
        columns: TableColumn[] | string[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new primary key.
     */
    async createPrimaryKey (
        tableOrName: Table | string,
        columnNames: string[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Updates composite primary keys.
     */
    async updatePrimaryKeys (
        tableOrName: Table | string,
        columns: TableColumn[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops a primary key.
     */
    async dropPrimaryKey (tableOrName: Table | string): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new unique constraint.
     */
    async createUniqueConstraint (
        tableOrName: Table | string,
        uniqueConstraint: TableUnique
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new unique constraints.
     */
    async createUniqueConstraints (
        tableOrName: Table | string,
        uniqueConstraints: TableUnique[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops an unique constraint.
     */
    async dropUniqueConstraint (
        tableOrName: Table | string,
        uniqueOrName: TableUnique | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops an unique constraints.
     */
    async dropUniqueConstraints (
        tableOrName: Table | string,
        uniqueConstraints: TableUnique[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new check constraint.
     */
    async createCheckConstraint (
        tableOrName: Table | string,
        checkConstraint: TableCheck
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new check constraints.
     */
    async createCheckConstraints (
        tableOrName: Table | string,
        checkConstraints: TableCheck[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops check constraint.
     */
    async dropCheckConstraint (
        tableOrName: Table | string,
        checkOrName: TableCheck | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops check constraints.
     */
    async dropCheckConstraints (
        tableOrName: Table | string,
        checkConstraints: TableCheck[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new exclusion constraint.
     */
    async createExclusionConstraint (
        tableOrName: Table | string,
        exclusionConstraint: TableExclusion
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new exclusion constraints.
     */
    async createExclusionConstraints (
        tableOrName: Table | string,
        exclusionConstraints: TableExclusion[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops exclusion constraint.
     */
    async dropExclusionConstraint (
        tableOrName: Table | string,
        exclusionOrName: TableExclusion | string
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops exclusion constraints.
     */
    async dropExclusionConstraints (
        tableOrName: Table | string,
        exclusionConstraints: TableExclusion[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new foreign key.
     */
    async createForeignKey (
        tableOrName: Table | string,
        foreignKey: TableForeignKey
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new foreign keys.
     */
    async createForeignKeys (
        tableOrName: Table | string,
        foreignKeys: TableForeignKey[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops a foreign key from the table.
     */
    async dropForeignKey (
        tableOrName: Table | string,
        foreignKey: TableForeignKey
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops a foreign keys from the table.
     */
    async dropForeignKeys (
        tableOrName: Table | string,
        foreignKeys: TableForeignKey[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new index.
     */
    async createIndex (
        tableOrName: Table | string,
        index: TableIndex
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Creates a new indices
     */
    async createIndices (
        tableOrName: Table | string,
        indices: TableIndex[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops an index from the table.
     */
    async dropIndex (collectionName: string, indexName: string): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops an indices from the table.
     */
    async dropIndices (
        tableOrName: Table | string,
        indices: TableIndex[]
    ): Promise<void> {
        throw new TypeORMError(
            'Schema update queries are not supported by Mock driver.'
        )
    }

    /**
     * Drops collection.
     */
    async clearTable (tableName: string): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Enables special query runner mode in which sql queries won't be executed,
     * instead they will be memorized into a special variable inside query runner.
     * You can get memorized sql using getMemorySql() method.
     */
    enableSqlMemory (): void {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Disables special query runner mode in which sql queries won't be executed
     * started by calling enableSqlMemory() method.
     *
     * Previously memorized sql will be flushed.
     */
    disableSqlMemory (): void {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Flushes all memorized sqls.
     */
    clearSqlMemory (): void {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Gets sql stored in the memory. Parameters in the sql are already replaced.
     */
    getMemorySql (): SqlInMemory {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Executes up sql queries.
     */
    async executeMemoryUpSql (): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    /**
     * Executes down sql queries.
     */
    async executeMemoryDownSql (): Promise<void> {
        throw new TypeORMError(
            'This operation is not supported by Mock driver.'
        )
    }

    getReplicationMode (): ReplicationMode {
        return 'master'
    }

    /**
     * Called before migrations are run.
     */
    beforeMigration (): Promise<void> {
        return Promise.resolve()
    }

    /**
     * Called after migrations are run.
     */
    afterMigration (): Promise<void> {
        return Promise.resolve()
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
}
