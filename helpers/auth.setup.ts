import { test as setup, expect } from '@playwright/test'
import {IdentityProvider} from '../auth/IdentityProvider';
import { AuthenticationManager } from '../auth/AuthenticationManager';




const baseUrl = process.env.BASE_URL!;

// ─────────────────────────────────────────────
// Setup: authenticate once and save session
// ─────────────────────────────────────────────

setup('authenticating all identities', async ({ browser }) => {

        const authManager = new AuthenticationManager(browser, baseUrl);
        const identities = new IdentityProvider().load();

        for (const identity of identities) {
            const filePath = await authManager.authenticateAndSave(identity);
            console.log(`Auth state saved for identity ${identity.id} to ${filePath}`);

        }

}
)
