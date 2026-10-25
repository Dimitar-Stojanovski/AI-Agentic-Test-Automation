import { test, expect } from "@utils/uiUtils/uiFixtures";
import type { Locator } from "@playwright/test";

const allImagesLoaded = (images: Locator) =>
  images.evaluateAll((elements) =>
    elements.every(
      (el) =>
        (el as HTMLImageElement).complete &&
        (el as HTMLImageElement).naturalWidth > 0,
    ),
  );

test.describe("Home page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHomePage();
  });

  test("TC-HOME-01: Home page loads with the correct title", async ({
    page,
    homePage,
  }) => {
    // Step 1: the page is opened again to capture the response
    const response = await homePage.navigateToHomePage();

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle("Sauce Demo");
    await expect(page).toHaveURL("/");
  });

  test("TC-HOME-02: Header links and cart summary are displayed", async ({
    homePage,
  }) => {
    await expect(homePage.headerSearchLink).toBeVisible();
    await expect(homePage.headerAboutUsLink).toBeVisible();
    await expect(homePage.headerLogInLink).toBeVisible();
    await expect(homePage.headerSignUpLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
    await expect(homePage.checkOutLink).toBeVisible();
  });

  test("TC-HOME-03: Header search box is present", async ({ homePage }) => {
    await expect(homePage.searchBox).toBeVisible();
    await expect(homePage.searchButton).toBeVisible();
  });

  test("TC-HOME-04: Logo and tagline are displayed", async ({ homePage }) => {
    await expect.poll(() => allImagesLoaded(homePage.logoImage)).toBe(true);

    await homePage.logoLink.hover();
    await expect(homePage.logoLink).toHaveCSS("cursor", "pointer");

    await expect(homePage.tagline).toHaveText(
      "Just a demo site showing off what Sauce can do.",
    );
  });

  test("TC-HOME-05: Sidebar menu items are displayed", async ({ homePage }) => {
    await expect(homePage.menuItems).toHaveText([
      "Home",
      "Catalog",
      "Blog",
      "About Us",
      "Wish list",
      "Refer a friend",
    ]);
  });

  test("TC-HOME-06: Social media icons are displayed", async ({ homePage }) => {
    await expect(homePage.facebookIcon).toBeVisible();
    await expect(homePage.twitterIcon).toBeVisible();
    await expect(homePage.instagramIcon).toBeVisible();
    await expect(homePage.pinterestIcon).toBeVisible();
    await expect(homePage.rssIcon).toBeVisible();
  });

  test("TC-HOME-07: Featured products are displayed", async ({ homePage }) => {
    await expect(homePage.productTiles).toHaveCount(3);

    await expect.poll(() => allImagesLoaded(homePage.productImages)).toBe(true);
    for (const tile of await homePage.productTiles.all()) {
      const image = await tile.getByRole("img").boundingBox();
      const name = await tile.getByRole("heading", { level: 3 }).boundingBox();
      const price = await tile.getByRole("heading", { level: 4 }).boundingBox();
      expect(image!.y + image!.height).toBeLessThanOrEqual(name!.y);
      expect(name!.y + name!.height).toBeLessThanOrEqual(price!.y);
    }

    for (const price of await homePage.productPrices.all()) {
      await expect(price).toHaveText(/^£\d+\.\d{2}\s*$/);
    }

    await expect(homePage.contentImages).toHaveCount(3);
  });

  test("TC-HOME-08: Footer content is displayed", async ({ homePage }) => {
    await homePage.footerSearchLink.scrollIntoViewIfNeeded();

    await expect(homePage.footerSearchLink).toBeVisible();
    await expect(homePage.footerAboutUsLink).toBeVisible();

    await expect(homePage.footerAboutText).toHaveText(
      /^This is a demo site created for Sauce/,
    );
    await expect(homePage.footerSauceLink).toBeVisible();

    await expect(homePage.cardLogos).toHaveCount(3);
    await expect.poll(() => allImagesLoaded(homePage.cardLogos)).toBe(true);
  });

  test("TC-HOME-09: Footer copyright bar is displayed", async ({
    homePage,
  }) => {
    await homePage.copyrightText.scrollIntoViewIfNeeded();

    await expect(homePage.copyrightText).toContainText(
      `Copyright © ${new Date().getFullYear()} Sauce Demo.`,
    );
    await expect(homePage.shopifyLink).toBeVisible();
    await expect(homePage.barSearchLink).toBeVisible();
    await expect(homePage.barAboutUsLink).toBeVisible();
  });

  test("TC-HOME-10: Icon links and icon buttons have accessible names", async ({
    homePage,
  }) => {
    // Known application defect: the search button is named "Submit" and the
    // social icon links have no accessible name. Remove once fixed.
    test.fail();
    // Steps 2-4 (screen reader, Tab) are verified through the accessible
    // names Playwright reads from the accessibility tree.
    await expect(homePage.searchButton).toHaveAccessibleName("Search");

    await expect(homePage.facebookIcon).toHaveAccessibleName("Facebook");
    await expect(homePage.twitterIcon).toHaveAccessibleName("Twitter");
    await expect(homePage.instagramIcon).toHaveAccessibleName("Instagram");
    await expect(homePage.pinterestIcon).toHaveAccessibleName("Pinterest");
    await expect(homePage.rssIcon).toHaveAccessibleName("RSS");
  });
});
