import { ObjectType } from 'typeorm/common/ObjectType'
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema'
import {
    DataSource, EntityManager,
    EntityTarget, QueryRunner
} from 'typeorm'
import { DriverFactory } from 'typeorm/driver/DriverFactory'
import { EntityManagerFactory } from 'typeorm/entity-manager/EntityManagerFactory'
import { MockEntityManager } from '../entity-manager/MockEntityManager'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { MockPagingAndSortingRepository } from '../repository/MockPagingAndSortingRepository'
import { MockDriver } from '../driver/MockDriver'

let connection: any = null
let entityManager: any = null
const map = new Map()

export class DatasourceManagerOptions {
    entities?: ((Function | string | EntitySchema))[];
    synchronize?: boolean
}

const DEFAULT_OPTIONS: DatasourceManagerOptions = {
    entities: ['**/entities/**/*.{js,ts}'],
    synchronize: false
}

export const mockDatasourceManager = {
    async open (options: DatasourceManagerOptions) {
        if (!connection) {
            DriverFactory.prototype.create = (connection: DataSource) => {
                return new MockDriver(connection)
            }
            EntityManager.prototype.getRepository = <Entity extends ObjectLiteral>(target: EntityTarget<Entity>): MockPagingAndSortingRepository<Entity> => {
                const repository: any = new MockPagingAndSortingRepository(target, entityManager, EntityManager.prototype.queryRunner)
                return repository
            }
            EntityManagerFactory.prototype.create = (connection: DataSource, queryRunner?: QueryRunner): EntityManager => {
                entityManager = new MockEntityManager(connection)
                return entityManager
            }
            options = Object.assign({ ...DEFAULT_OPTIONS }, options)
            const connectionOptions: any = {
                type: 'mockdb',
                entities: options?.entities
            }
            connection = await new DataSource(connectionOptions).initialize()
        }

        if (options.synchronize) {
            console.log('synchronizing database ... ')
            await connection.synchronize()
        }

        return connection
    },

    getConnection (name?: string) {
        // maintaining a list of connections was deprecated by typeorm
        // we could maintain a map of all the names in the future
        // to recreate the original typeorm logic
        if (!connection) {
            throw new Error('connection is undefined.  Did you forget to call open()?')
        }
        return connection
    },

    getCustomRepository<T, Entity> (customRepository: { new(a: any, b: any): T ;}, customEntity: ObjectType<Entity>, name?: string): T {
        let repository: any = map.get(customEntity)
        if (!repository) {
            repository = new customRepository(customEntity, connection.createEntityManager())
            map.set(customEntity, repository)
        }
        return repository
    },

    getRepository<Entity extends ObjectLiteral> (target: EntityTarget<Entity>, name?: string): MockPagingAndSortingRepository<Entity> {
        let repository: any = map.get(target)
        if (!repository) {
            repository = mockDatasourceManager.getConnection(name).getRepository(target)
            map.set(target, repository)
        }
        return repository
    },

    async close () {
        // does nothing in mockdb.  Adding for compatability with other libraries.
    }
}

export const open = async (options: DatasourceManagerOptions) => {
    return mockDatasourceManager.open(options)
}

export const getConnection = (name?: string) => {
    return mockDatasourceManager.getConnection(name)
}

export const getCustomRepository = <T, Entity> (customRepository: { new(a: any, b: any): T ;}, customEntity: ObjectType<Entity>, name?: string): T => {
    return mockDatasourceManager.getCustomRepository(customRepository, customEntity)
}

export const getRepository = <Entity extends ObjectLiteral> (target: EntityTarget<Entity>, name?: string): MockPagingAndSortingRepository<Entity> => {
    return mockDatasourceManager.getRepository(target, name)
}

export const close = () => {
    return mockDatasourceManager.close()
}
