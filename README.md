# typeorm-mock-db
Mock Typeorm Database for Unit Testing

An experimental Mock database for Typeorm

```typescript
import expect from 'expect'
import sinon from 'sinon'
import { PowershellRunner } from '../../src/runners/powershell-runner'
import { coreEdiscoveryService } from '../../src/services/core-ediscovery-service'
import { StagePushMicrosoftCaseHoldRuleRepository } from '../../src/repositories/stage-push-microsoft-case-hold-rule-repository'
import PushCaseHoldRuleTask from '../../src/tasks/push-case-hold-rule-task'
import { LiveMicrosoftCaseHoldRuleRepository } from '../../src/repositories/live-microsoft-case-hold-rule-repository'
import allEntities from '../../src/entities/all-entities'
import { MockDB, mockDatasourceManager } from 'typeorm-mock-db'
import { LiveMicrosoftCaseRepository } from '../../src/repositories/live-microsoft-case-repository'
import { LiveMicrosoftCase } from '../../src/entities/live-microsoft-case'
import { LiveMicrosoftHoldPolicyRepository } from '../../src/repositories/live-microsoft-hold-policy-repository'
import { LiveMicrosoftHoldPolicy } from '../../src/entities/live-microsoft-hold-policy'
import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional'
import { LiveMicrosoftCaseHoldRule } from '../../src/entities/live-microsoft-case-hold-rule'
import { datasourceManager } from '@lmig/legal-nodejs-postgres'
import { ObjectType } from 'typeorm'

const PENDING_RULE: any = {
    syncStatus: 'PENDING-PUSH'
}

let connection: any

describe('happy path', () => {
    beforeEach(async () => {
        sinon.restore()
        if (!connection) {
            connection = await new MockDB({
                entities: allEntities
            }).initialize()
            initializeTransactionalContext()
            addTransactionalDataSource(connection)
            jest.mock('typeorm-transactional', () => ({
                Transactional: () => () => ({})
            }))
        }

        const user = new User()
        user.id = '123'
        sinon.stub(UserRepository.prototype, 'findOne').resolves(user)
    })

    it('find user', async () => {

        const response = await connection.getRepository(User)

        /** Then: No exception is thrown **/
        expect(response).toBeDefined()
    })
    
})

```
