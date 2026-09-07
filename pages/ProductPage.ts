import { Page, expect } from '@playwright/test';


export class ProductPage {

    constructor(private page: Page) { }

       // ─────────────────────────────────────────────
    // Locators — private methods for dynamic locators
    // ─────────────────────────────────────────────

    private getProductNameHeading(name: string) {
        return this.page.getByRole('heading', {
            name: name
        });
    }

    // ─────────────────────────────────────────────
    // Actions
    // ─────────────────────────────────────────────

    async verifyProductName(name: string) {

        await expect(
            this.getProductNameHeading(name)
        ).toBeVisible();
    }


    async verifyURL(expectedUrl: string) {

        await expect(this.page)
            .toHaveURL(new RegExp(expectedUrl));

    }

}

