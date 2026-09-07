

import { Page, expect } from '@playwright/test';

export class ShopPage {

    // ─────────────────────────────────────────────
    // Locators — readonly properties, initialized once
    // ─────────────────────────────────────────────
    private readonly searchBox;
    private readonly searchButton;
    private readonly searchResults;
    private readonly priceFilterInput;
    private readonly productList;
    private readonly cartLink;

    constructor(private page: Page) {
        this.searchBox = this.page.getByRole('searchbox', { name: 'Search' });
        this.searchButton = this.page.getByRole('button', { name: 'Search' });
        this.searchResults = this.page.getByRole('heading', { name: 'Search results' });
        this.priceFilterInput = this.page.getByRole('textbox', {
            name: 'Filter products by maximum'
        });
        this.productList = this.page.locator('ul.products li');
        this.cartLink = this.page.getByRole('link', {
            name: /View Shopping Cart/i
        });
    }

    // ─────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────
    // private get searchBox() {
    //     return this.page.getByRole('searchbox', { name: 'Search' });
    // }

    // private get searchButton() {
    //     return this.page.getByRole('button', { name: 'Search' });
    // }

    // private get searchResults() {
    //     return this.page.getByRole('heading', { name: 'Search results' });
    // }

    // private get priceFilterInput() {
    //     return this.page.getByRole('textbox', {
    //         name: 'Filter products by maximum'
    //     });
    // }

    // private get productList() {
    //     return this.page.locator('ul.products li');
    // }

    // private get cartLink() {
    //     return this.page.getByRole('link', {
    //         name: /View Shopping Cart/i
    //     });
    // }

    // ─────────────────────────────────────────────
    // Actions
    // ─────────────────────────────────────────────
    async navigate() {
        await this.page.goto('/demoshop/');
        await expect(
            this.page.getByRole('heading', { name: 'DemoShop' })
        ).toBeVisible();
        await this.productList.first().waitFor({ state: 'visible' });
    }

    async search(keyword: string) {
        await this.searchBox.fill(keyword);
        await this.searchButton.click();
        await this.searchResults.waitFor({ state: 'visible' });
        await expect(this.searchResults).toContainText(keyword);

        // Verify every result contains the keyword
        const products = this.productList;
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const title = await products.nth(i)
                .locator('h2').textContent();
            expect(title?.toLowerCase())
                .toContain(keyword.toLowerCase());
        }
    }

    async applyPriceFilter(maxPrice: string) {
        await this.priceFilterInput.fill(maxPrice);
        const maxPriceNum = Number(maxPrice.replace('$', ''));
        await this.page.getByText(`Up to $${maxPriceNum}`)
            .waitFor({ state: 'visible' });

        // Verify every product is within price range
        const products = this.productList;
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const priceText = await products.nth(i)
                .locator('.price').textContent();
            const price = Number(priceText?.replace(/[^0-9.]/g, ''));
            expect(price).toBeLessThanOrEqual(maxPriceNum);
        }
    }

    async addFirstProductToCart(): Promise<string> {
        const products = this.productList;
        await expect(products.first()).toBeVisible();

        const firstProduct = products.first();
        const productName = await firstProduct
            .locator('h2').textContent();
        expect(productName).toBeTruthy();

        const addToCartButton = firstProduct.getByRole('button', {
            name: /Add to cart/i
        });
        await addToCartButton.click();
        await expect(addToCartButton).toHaveClass(/added/);

        await expect(this.cartLink).toBeVisible();
        await Promise.all([
            this.page.waitForURL(/mycart/),
            this.cartLink.click()
        ]);

        await expect(
            this.page.getByText(productName!, { exact: true })
        ).toBeVisible();

        return productName!;
    }


    async openProductInNewTab(productName: string) {

        // Locate the product link
        const productLink = this.page
            .getByRole('link', { name: productName })
            .first();

        // Verify the link is configured to open in a new tab
        await expect(productLink).toHaveAttribute('target', '_blank');

        // Listen for the new page event BEFORE clicking the link
        // Promise.all prevents a race condition where the tab opens
        // before Playwright starts listening for it.

        const [productTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            productLink.click()
        ]);

        // Wait until the new page finishes loading
        await productTab.waitForLoadState();
        return productTab

    }
    async clearCart() {
        await this.page.goto('/mycart/');
        await this.page.waitForLoadState('domcontentloaded');

        while (true) {
            const removeLinks = this.page.locator('a.remove');
            const count = await removeLinks.count();

            if (count === 0) {
                break;
            }

            await expect(removeLinks.first()).toBeVisible();

            await Promise.all([
                this.page.waitForURL(/mycart/i),
                removeLinks.first().click({ force: true })
            ]);

            await this.page.waitForLoadState('domcontentloaded');
            await this.page.locator('.blockUI').first().waitFor({ state: 'detached' }).catch(() => undefined);
            await this.page.waitForLoadState('networkidle');
            await this.page.goto('/mycart/');
            await this.page.waitForLoadState('domcontentloaded');
        }

        // Remove coupon if still applied
        const removeCouponButton = this.page.getByRole('button', {
            name: /remove.*coupon/i
        });
        if (await removeCouponButton.count() > 0) {
            await removeCouponButton.first().click();
            await this.page.waitForLoadState('networkidle');
        }

        await expect(this.page.getByText(/your cart is currently empty/i)).toBeVisible();

    }

}

