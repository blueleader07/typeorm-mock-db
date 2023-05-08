import { FindOptions, ObjectLiteral, Repository } from 'typeorm'

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

export class MockPagingAndSortingRepository<T extends ObjectLiteral> extends Repository<T> {
    /**
     * Queries by page size and exclusiveStartKey
     */
    findPage (options: FindOptions, pageable: Pageable): Page<T> {
        return {
            content: [],
            size: 15,
            numberOfElements: 0
        }
    }

    /**
     * Queries ALL items then returns the desired subset
     * WARNING: This is NOT an efficient way of querying dynamodb.
     * Please only use this if you must, preferably on lightly used pages
     */
    findPageWithCountExpensive (
        options: FindOptions,
        pageable: Pageable
    ): Page<T> {
        return {
            content: [],
            size: 15,
            numberOfElements: 0
        }
    }
}
