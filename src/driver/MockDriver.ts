import {
    ColumnType,
    DataSource,
    DataSourceOptions,
    DriverPackageNotInstalledError,
    EntityMetadata,
    InstanceChecker,
    ObjectLiteral, QueryRunner,
    ReplicationMode,
    Table,
    TableColumn,
    TableForeignKey,
    TypeORMError
} from 'typeorm'
import { Driver } from 'typeorm/driver/Driver'
import { DataTypeDefaults } from 'typeorm/driver/types/DataTypeDefaults'
import { MappedColumnTypes } from 'typeorm/driver/types/MappedColumnTypes'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { SchemaBuilder } from 'typeorm/schema-builder/SchemaBuilder'
import { View } from 'typeorm/schema-builder/view/View'
import { ObjectUtils } from 'typeorm/util/ObjectUtils'
import { CteCapabilities } from 'typeorm/driver/types/CteCapabilities'
import { UpsertType } from 'typeorm/driver/types/UpsertType'
import { DriverUtils } from 'typeorm/driver/DriverUtils'
import { ApplyValueTransformers } from 'typeorm/util/ApplyValueTransformers'
import { MockQueryRunner } from './MockQueryRunner'
import { MockSchemaBuilder } from './MockSchemaBuilder'

/**
 * Organizes communication with MongoDB.
 */
export class MockDriver implements Driver {
    /**
     * Underlying mockdb library.
     */
    mockdb: any

    /**
     * Connection options.
     */
    options: DataSourceOptions

    database?: string | undefined
    schema?: string | undefined
    isReplicated: boolean
    treeSupport: boolean
    transactionSupport: 'simple' | 'nested' | 'none'
    supportedDataTypes: ColumnType[] = [
        'string',
        'number',
        'binary'
    ]

    supportedUpsertTypes: UpsertType[] = []

    dataTypeDefaults: DataTypeDefaults = {}
    spatialTypes: ColumnType[] = []

    /**
     * Gets list of column data types that support length by a driver.
     */
    withLengthColumnTypes: ColumnType[] = ['string']

    withPrecisionColumnTypes: ColumnType[] = []
    withScaleColumnTypes: ColumnType[] = []

    /**
     * Orm has special columns and we need to know what database column types should be for those types.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes = {
        createDate: 'varchar',
        createDateDefault: 'now()',
        updateDate: 'varchar',
        updateDateDefault: 'now()',
        deleteDate: 'varchar',
        deleteDateNullable: true,
        version: 'varchar',
        treeLevel: 'varchar',
        migrationId: 'varchar',
        migrationName: 'varchar',
        migrationTimestamp: 'varchar',
        cacheId: 'varchar',
        cacheIdentifier: 'varchar',
        cacheTime: 'varchar',
        cacheDuration: 'varchar',
        cacheQuery: 'varchar',
        cacheResult: 'varchar',
        metadataType: 'varchar',
        metadataDatabase: 'varchar',
        metadataSchema: 'varchar',
        metadataTable: 'varchar',
        metadataName: 'varchar',
        metadataValue: 'varchar'
    }

    maxAliasLength?: number | undefined

    /**
     * MockDB does not require to dynamically create query runner each time,
     * because it does not have a regular connection pool as RDBMS systems have.
     */
    queryRunner?: QueryRunner

    // constructor(connection: Connection) {
    //     this.connection = connection;
    // }

    constructor (protected connection: DataSource) {
        this.options = connection.options as unknown as DataSourceOptions

        // validate options to make sure everything is correct and driver will be able to establish connection
        this.validateOptions(connection.options)

        // load mongodb package
        this.loadDependencies()

        this.database = DriverUtils.buildMongoDBDriverOptions(
            this.options
        ).database
    }

    supportedUpsertType?: UpsertType | undefined
    cteCapabilities: CteCapabilities

    /**
     * Validate driver options to make sure everything is correct and driver will be able to establish connection.
     */
    protected validateOptions (options: DataSourceOptions) {
        // todo: fix
        // if (!options.url) {
        //     if (!options.database)
        //         throw new DriverOptionNotSetError("database");
        // }
    }

    /**
     * Loads all driver dependencies.
     */
    protected loadDependencies (): any {
        try {
            this.mockdb = this.options.driver || {}
        } catch (e) {
            throw new DriverPackageNotInstalledError('MockDB', 'mockdb')
        }
    }

    connect (): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.queryRunner = new MockQueryRunner(
                    this.connection,
                    undefined
                )
                ObjectUtils.assign(this.queryRunner, {
                    manager: this.connection.manager
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    afterConnect (): Promise<void> {
        return Promise.resolve()
    }

    disconnect (): Promise<void> {
        return Promise.resolve()
    }

    createSchemaBuilder (): SchemaBuilder {
        return new MockSchemaBuilder(this.connection)
    }

    createQueryRunner (mode: ReplicationMode) {
        return this.queryRunner!
    }

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters (
        sql: string,
        parameters: ObjectLiteral,
        nativeParameters: ObjectLiteral
    ): [string, any[]] {
        throw new TypeORMError(
            'This operation is not supported by MockDB driver.'
        )
    }

    escape (name: string): string {
        return name
    }

    buildTableName (
        tableName: string,
        schema?: string,
        database?: string
    ): string {
        const parts = [tableName]
        if (schema) {
            parts.unshift(schema)
        }
        if (database) {
            parts.unshift(database)
        }
        return parts.join('.')
    }

    /**
     * Parse a target table name or other types and return a normalized table definition.
     */
    parseTableName (
        target: EntityMetadata | Table | View | TableForeignKey | string
    ): { tableName: string; schema?: string; database?: string } {
        if (InstanceChecker.isEntityMetadata(target)) {
            return {
                tableName: target.tableName
            }
        }

        if (InstanceChecker.isTable(target) || InstanceChecker.isView(target)) {
            return {
                tableName: target.name
            }
        }

        if (InstanceChecker.isTableForeignKey(target)) {
            return {
                tableName: target.referencedTableName
            }
        }

        return {
            tableName: target
        }
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue (value: any, columnMetadata: ColumnMetadata): any {
        if (columnMetadata.transformer) {
            value = ApplyValueTransformers.transformTo(
                columnMetadata.transformer,
                value
            )
        }
        return value
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue (value: any, columnMetadata: ColumnMetadata): any {
        if (columnMetadata.transformer) {
            value = ApplyValueTransformers.transformFrom(
                columnMetadata.transformer,
                value
            )
        }
        return value
    }

    normalizeType (column: {
        type?:
            | string
            | BooleanConstructor
            | DateConstructor
            | NumberConstructor
            | StringConstructor
            | undefined
        length?: string | number | undefined
        precision?: number | null | undefined
        scale?: number | undefined
        isArray?: boolean | undefined
    }): string {
        if (
            column.type === Number ||
            column.type === 'int' ||
            column.type === 'int4'
        ) {
            return 'number'
        } else if (
            column.type === String ||
            column.type === 'varchar' ||
            column.type === 'varchar2'
        ) {
            return 'string'
        } else if (
            column.type === Date ||
            column.type === 'timestamp' ||
            column.type === 'date' ||
            column.type === 'datetime'
        ) {
            return 'string'
        } else if (column.type === 'timestamptz') {
            return 'string'
        } else if (column.type === 'time') {
            return 'string'
        } else if (column.type === 'timetz') {
            return 'string'
        } else if (column.type === Boolean || column.type === 'bool') {
            return 'string'
        } else if (column.type === 'simple-array') {
            return 'string'
        } else if (column.type === 'simple-json') {
            return 'string'
        } else if (column.type === 'simple-enum') {
            return 'string'
        } else if (column.type === 'int2') {
            return 'number'
        } else if (column.type === 'int8') {
            return 'string'
        } else if (column.type === 'decimal') {
            return 'string'
        } else if (column.type === 'float8' || column.type === 'float') {
            return 'string'
        } else if (column.type === 'float4') {
            return 'string'
        } else if (column.type === 'char') {
            return 'string'
        } else if (column.type === 'varbit') {
            return 'string'
        } else {
            return (column.type as string) || ''
        }
    }

    /**
     * Normalizes "default" value of the column.
     */
    normalizeDefault (columnMetadata: ColumnMetadata): string | undefined {
        throw new TypeORMError(
            'MongoDB is schema-less, not supported by this driver.'
        )
    }

    /**
     * Normalizes "isUnique" value of the column.
     */
    normalizeIsUnique (column: ColumnMetadata): boolean {
        throw new TypeORMError(
            'MongoDB is schema-less, not supported by this driver.'
        )
    }

    /**
     * Calculates column length taking into account the default length values.
     */
    getColumnLength (column: ColumnMetadata): string {
        throw new TypeORMError(
            'MongoDB is schema-less, not supported by this driver.'
        )
    }

    /**
     * Normalizes "default" value of the column.
     */
    createFullType (column: TableColumn): string {
        throw new TypeORMError(
            'MongoDB is schema-less, not supported by this driver.'
        )
    }

    /**
     * Obtains a new database connection to a master server.
     * Used for replication.
     * If replication is not setup then returns default connection's database connection.
     */
    obtainMasterConnection (): Promise<any> {
        return Promise.resolve()
    }

    /**
     * Obtains a new database connection to a slave server.
     * Used for replication.
     * If replication is not setup then returns master (default) connection's database connection.
     */
    obtainSlaveConnection (): Promise<any> {
        return Promise.resolve()
    }

    /**
     * Creates generated map of values generated or returned by database after INSERT query.
     */
    createGeneratedMap (metadata: EntityMetadata, insertedId: any) {
        return metadata.objectIdColumn!.createValueMap(insertedId)
    }

    /**
     * Differentiate columns of this table and columns from the given column metadatas columns
     * and returns only changed.
     */
    findChangedColumns (
        tableColumns: TableColumn[],
        columnMetadatas: ColumnMetadata[]
    ): ColumnMetadata[] {
        throw new TypeORMError(
            'MockDB is schema-less, not supported by this driver.'
        )
    }

    isReturningSqlSupported (): boolean {
        return false
    }

    isUUIDGenerationSupported (): boolean {
        return false
    }

    isFullTextColumnTypeSupported (): boolean {
        return false
    }

    createParameter (parameterName: string, index: number): string {
        return ''
    }
}
