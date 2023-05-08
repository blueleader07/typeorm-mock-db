import { mockDatasourceManager } from './manager/mock-datasource-manager'
import { MockPagingAndSortingRepository } from './repository/MockPagingAndSortingRepository'
import { DriverFactory } from 'typeorm/driver/DriverFactory'
import { DataSource, EntityManager, EntityTarget, QueryRunner } from 'typeorm'
import { MockDriver } from './driver/MockDriver'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { EntityManagerFactory } from 'typeorm/entity-manager/EntityManagerFactory'
import { EntityMetadataValidator } from 'typeorm/metadata-builder/EntityMetadataValidator'
import { MockEntityManager } from './entity-manager/MockEntityManager'

let map: Map<string, MockPagingAndSortingRepository<any>>
let connection: DataSource
let entityManager: EntityManager

export interface MockOptions {
    entities: any[]
}

class MockDB {
    options: MockOptions

    constructor (options: MockOptions) {
        this.options = options
    }

    async initialize () {
        // jest.mock('typeorm-transactional', () => ({
        //     Transactional: () => () => ({})
        // }))
        const entities = this.options.entities || []
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
        EntityMetadataValidator.prototype.validate = () => {
            return true
        }
        connection = await mockDatasourceManager.open({
            entities
        })
        map = new Map()
        entities.forEach(entityClass => {
            map.set(entityClass.name, new MockPagingAndSortingRepository(entityClass, connection.manager))
        })
        return connection
    }
}

export {
    mockDatasourceManager,
    MockDB
}
