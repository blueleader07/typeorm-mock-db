import { MockDB } from '../../src'
import { Dummy } from '../entities/dummy'
import { getRepository } from '../../src/manager/mock-datasource-manager'
import sinon from 'sinon'
import expect from 'expect'
describe('mock-entity-manager', () => {
    beforeEach(async () => {
        await new MockDB({
            entities: [Dummy]
        }).initialize()
    })
    it('happy path', async () => {
        const dummy = new Dummy()
        dummy.id = '123'
        const dummyRepository = getRepository(Dummy)
        sinon.stub(dummyRepository, 'findOne').resolves(dummy)

        const response = await dummyRepository.findOne({
            where: {
                id: '123'
            }
        })

        expect(response!.id).toBe('123')
    })
})
