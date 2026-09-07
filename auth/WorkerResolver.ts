import path from 'path'
import { Identity, IdentityProvider } from './IdentityProvider'

export class WorkerResolver {

    private identities: Identity[]

    constructor(identityProvider: IdentityProvider){

        this.identities = identityProvider.load()

    }

    resolve(workerIndex: number): { identity: Identity; storagePath: string } {

        const identity = this.identities[workerIndex %  this.identities.length]
        const storagePath=path.join(__dirname,'storage',`${identity.id}.json`)

        return { identity, storagePath }

    }
}