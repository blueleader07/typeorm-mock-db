/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MockDB driver which has some specifics in its EntityManager.
 */
import { EntityManager } from 'typeorm/entity-manager/EntityManager'

export class MockEntityManager extends EntityManager {

}
