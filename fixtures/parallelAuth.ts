import {test as base} from '@playwright/test'
import { IdentityProvider } from '../auth/IdentityProvider'
import { WorkerResolver } from '../auth/WorkerResolver'

export const test = base.extend<{}, {workerStorageState: string}>({
    workerStorageState: [ async ({}, use, testInfo) => {
        const workerResolver = new WorkerResolver(new IdentityProvider())
        const { storagePath } = workerResolver.resolve(testInfo.parallelIndex)

        await use(storagePath)
    }, { scope: 'worker' }]
})