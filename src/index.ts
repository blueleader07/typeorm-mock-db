import sinon from 'sinon'
import { datasourceManager } from './manager/datasource-manager'
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

export const MockDB = {
    create: async (options: MockOptions) => {
        const entities = options.entities || []
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
        connection = await datasourceManager.open({
            entities
        })
        sinon.stub(datasourceManager, 'getConnection').callsFake(() => {
            return connection
        })
        sinon.stub(datasourceManager, 'getCustomRepository').callsFake((repositoryClass: any, entityClass: any) => {
            const repository = map.get(entityClass.name)
            if (repository) {
                return repository
            }
            throw Error(`Repository is not mocked: ${repositoryClass}`)
        })
        sinon.stub(datasourceManager, 'getRepository').callsFake((entityClass: any): any => {
            const repository = map.get(entityClass.name)
            if (repository) {
                return repository
            }
            throw Error(`Repository is not mocked: ${entityClass}`)
        })
        map = new Map()
        entities.forEach(entityClass => {
            map.set(entityClass.name, new MockPagingAndSortingRepository(entityClass, connection.manager))
        })
    },
    reset () {
        sinon.restore()
    }
}
