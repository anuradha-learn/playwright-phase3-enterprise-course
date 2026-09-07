import {test as base} from './parallelAuth'
import { expect, Page, BrowserContext } from '@playwright/test'
import { worker } from 'cluster'
import path from 'path'

//path of auth file
// const authFile = path.join(__dirname, '..', 'auth', 'storageState.json')

//declare the fixture type

type AuthFixtures = {
    loggedInPage: Page
}

// const authFile = testInfo.workerIndex === 0
//     ? path.join(__dirname, '..', 'auth', 'user1-storageState.json')
//     : testInfo.workerIndex === 1
//     ? path.join(__dirname, '..', 'auth', 'user2-storageState.json')
//     : path.join(__dirname, '..', 'auth', 'user3-storageState.json')

//build the fixture

export const test = base.extend<AuthFixtures>({

    loggedInPage: async ({ browser , workerStorageState }, use, testInfo) => {
        console.log("Fixture Started");
        console.log(`Worker : ${testInfo.workerIndex}`);
        console.log(`Test   : ${testInfo.title}`);

        // ── Setup ─────────────────────────────
        // Create a new context with saved auth state

        console.log("Creating BrowserContext...");
  

        const context: BrowserContext = await browser.newContext({
            storageState: workerStorageState,
            recordVideo:{
                dir:testInfo.outputDir
            }
        })
        console.log("Creating Page..."); 
        //Hand authenticated page to test
        const page: Page = await context.newPage()
        console.log("Control passed to test...");

        await use(page)
        console.log("Control returned from test...");

        // ── Teardown ─────────────────────────────
        // Close the manually created context
        await context.close()
        console.log("Closing BrowserContext...");
        console.log("BrowserContext Closed");
        console.log("Fixture Finished");
        if (testInfo.status!='passed'){

            const videoPath=await page.video()?.path()
            if (videoPath)
            {
                await testInfo.attach('video',{path:videoPath,
                    contentType:'video/webm'})
            }

        }
        else{

            await page.video()?.delete()
        }

    }

})

export { expect };