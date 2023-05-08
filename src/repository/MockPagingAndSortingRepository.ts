import { DeepPartial, FindOptions, ObjectLiteral, Repository, TypeORMError } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

interface Order {
    direction: string
    property: string
}

interface Sort {
    orders: Order[]
}

interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    exclusiveStartKey?: string
}

interface Page<T> {
    content: T[]
    size: number
    lastEvaluatedKey?: string
    numberOfElements: number
}

export class MockPagingAndSortingRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    /**
     * Queries by page size and exclusiveStartKey
     */
    findPage (options: FindOptions, pageable: Pageable): Page<Entity> {
        throw new TypeORMError('findPage is not stubbed.')
    }

    /**
     * Queries ALL items then returns the desired subset
     * WARNING: This is NOT an efficient way of querying dynamodb.
     * Please only use this if you must, preferably on lightly used pages
     */
    findPageWithCountExpensive (
        options: FindOptions,
        pageable: Pageable
    ): Page<Entity> {
        throw new TypeORMError('findPageWithCountExpensive is not stubbed.')
    }

    /** DynamoDB Compatible **/
    put (content: DeepPartial<Entity> | DeepPartial<Entity>[]) {
        throw new TypeORMError('put is not stubbed.')
    }

    putMany (content: DeepPartial<Entity>[]) {
        throw new TypeORMError('putMany is not stubbed.')
    }

    putOne (content: DeepPartial<Entity | Entity[]>) {
        throw new TypeORMError('putOne is not stubbed.')
    }

    scan () {
        throw new TypeORMError('scan is not stubbed.')
    }

    deleteOne (key: QueryDeepPartialEntity<Entity>) {
        throw new TypeORMError('deleteOne is not stubbed.')
    }

    deleteMany (keys: QueryDeepPartialEntity<Entity>[]) {
        throw new TypeORMError('deleteMany is not stubbed.')
    }

    async deleteAll (keyMapper?: any) {
        throw new TypeORMError('deleteAll is not stubbed.')
    }

    deleteAllBy (options: FindOptions, keyMapper?: any) {
        throw new TypeORMError('deleteAllBy is not stubbed.')
    }

    async deleteQueryBatch (options: FindOptions, keyMapper?: any) {
        throw new TypeORMError('deleteQueryBatch is not stubbed.')
    }

    batchRead (keys: any[]) {
        throw new TypeORMError('deleteQueryBatch is not stubbed.')
    }

    batchWrite (writes: any[]) {
        throw new TypeORMError('deleteQueryBatch is not stubbed.')
    }

    updateExpression (
        options: any
    ): Promise<any> {
        throw new TypeORMError('deleteQueryBatch is not stubbed.')
    }

    async streamAll () {
        throw new TypeORMError('deleteQueryBatch is not stubbed.')
    }
}
