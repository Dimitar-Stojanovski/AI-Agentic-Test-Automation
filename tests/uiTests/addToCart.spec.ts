import { test, expect } from "@utils/uiUtils/uiFixtures";
import { cartCountLabel, cartTotalLabel, formatMoney } from "@utils/formatters";
import {
  HEELS,
  INVALID_QUANTITIES,
  LARGE_QUANTITY,
  SANDALS,
  SIZES,
  TOP,
} from "@utils/testData/products";

test.describe("Add to cart", () => {
  test("TC-CART-01: Add an in-stock product with default options", async ({
    page,
    catalogPage,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    // Steps 1-3
    await catalogPage.navigateToCatalog();
    await catalogPage.openProduct(HEELS.name);
    const title = await productPage.title.innerText();
    const price = await productPage.unitPrice();

    // Step 4
    await productPage.addToCart();
    await expect(page).toHaveURL(new RegExp(`/products/${HEELS.handle}`));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));

    // Step 5
    await cartPage.navigateToCart();
    const row = cartPage.rowFor(title);
    await expect(row).toHaveCount(1);
    await expect(cartPage.unitPriceOf(row)).toHaveText(formatMoney(price));
    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(row)).toHaveText(formatMoney(price));
    await expect(cartPage.total).toHaveText(cartTotalLabel(price));
  });

  test("TC-CART-02: Add a product with a chosen size and color", async ({
    productPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const price = await productPage.unitPrice();
    const color = await productPage.colorDropdown.inputValue();
    await productPage.selectSize(SIZES.medium);
    await productPage.addToCart();
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(`${HEELS.name} - ${SIZES.medium} / ${color}`);
    await expect(row).toHaveCount(1);
    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.unitPriceOf(row)).toHaveText(formatMoney(price));
  });

  test("TC-CART-03: Add the same variant twice increases the quantity", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await productPage.addProductToCart(HEELS.handle, 2);
    await cartPage.navigateToCart();

    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(2));
    const row = cartPage.rowFor(HEELS.name);
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantityOf(row)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(row)).toHaveText(formatMoney(price * 2));
    await expect(cartPage.total).toHaveText(cartTotalLabel(price * 2));
  });

  test("TC-CART-04: Different variants of one product create separate rows", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const price = await productPage.unitPrice();
    await productPage.selectSize(SIZES.medium);
    await productPage.addToCart();
    await productPage.selectSize(SIZES.large);
    await productPage.addToCart();
    await cartPage.navigateToCart();

    const rowM = cartPage.rowFor(`${HEELS.name} - ${SIZES.medium}`);
    const rowL = cartPage.rowFor(`${HEELS.name} - ${SIZES.large}`);
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.quantityOf(rowM)).toHaveValue("1");
    await expect(cartPage.quantityOf(rowL)).toHaveValue("1");
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(2));
    await expect(cartPage.total).toHaveText(cartTotalLabel(price * 2));
  });

  test("TC-CART-05: Add several different products", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const priceA = await productPage.addProductToCart(HEELS.handle);
    const priceB = await productPage.addProductToCart(SANDALS.handle);
    await cartPage.navigateToCart();

    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.unitPriceOf(cartPage.rowFor(HEELS.name))).toHaveText(
      formatMoney(priceA),
    );
    await expect(
      cartPage.unitPriceOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveText(formatMoney(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(2));
    await expect(cartPage.total).toHaveText(cartTotalLabel(priceA + priceB));
  });

  // Needs at least one sold-out product in the store catalog
  test("TC-CART-06: Sold-out product cannot be added", async ({
    catalogPage,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await catalogPage.navigateToCatalog();
    await catalogPage.openFirstSoldOutProduct();
    await productPage.clickSoldOut();

    await expect(productPage.soldOutButton).toHaveText("Sold Out");
    await expect(productPage.soldOutButton).toBeDisabled();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(0));

    await cartPage.navigateToCart();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test("TC-CART-07: Cart contents and header counter persist across pages", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);

    await navigationPage.openHome();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
    await navigationPage.openCatalog();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
    await navigationPage.openAboutUs();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));

    await page.reload();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));

    await cartPage.navigateToCart();
    await expect(cartPage.quantityOf(cartPage.rowFor(HEELS.name))).toHaveValue(
      "1",
    );
  });

  test("TC-CART-08: Empty cart state", async ({
    page,
    navigationPage,
    cartPage,
  }) => {
    await cartPage.navigateToCart();
    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.continueShoppingLink).toBeVisible();
    await expect(cartPage.rows).toHaveCount(0);
    await expect(cartPage.updateButton).toHaveCount(0);
    await expect(cartPage.checkOutButton).toHaveCount(0);
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(0));

    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL("/collections/all");
  });

  test("TC-CART-09: Continue Shopping from a cart with items", async ({
    page,
    productPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();

    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL("/collections/all");

    await cartPage.navigateToCart();
    await expect(cartPage.quantityOf(cartPage.rowFor(HEELS.name))).toHaveValue(
      "1",
    );
  });

  test("TC-CART-10: Increase quantity and update", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, "3");
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue("3");
    await expect(cartPage.lineTotalOf(row)).toHaveText(formatMoney(price * 3));
    await expect(cartPage.total).toHaveText(cartTotalLabel(price * 3));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(3));
  });

  test("TC-CART-11: Decrease quantity and update", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await productPage.addProductToCart(HEELS.handle, 3);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, "1");
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(row)).toHaveText(formatMoney(price));
    await expect(cartPage.total).toHaveText(cartTotalLabel(price));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
  });

  test("TC-CART-12: Update one line in a multi-product cart", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const priceA = await productPage.addProductToCart(HEELS.handle);
    const priceB = await productPage.addProductToCart(SANDALS.handle);
    await cartPage.navigateToCart();

    const rowA = cartPage.rowFor(HEELS.name);
    const rowB = cartPage.rowFor(SANDALS.name);
    await cartPage.setQuantity(rowA, "2");
    await cartPage.update();

    await expect(cartPage.quantityOf(rowA)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(rowA)).toHaveText(
      formatMoney(priceA * 2),
    );
    await expect(cartPage.quantityOf(rowB)).toHaveValue("1");
    await expect(cartPage.total).toHaveText(
      cartTotalLabel(priceA * 2 + priceB),
    );
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(3));
  });

  test("TC-CART-13: Quantity set to 0 removes the line", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    const priceB = await productPage.addProductToCart(SANDALS.handle);
    await cartPage.navigateToCart();

    await cartPage.setQuantity(cartPage.rowFor(HEELS.name), "0");
    await cartPage.update();

    await expect(cartPage.rowFor(HEELS.name)).toHaveCount(0);
    await expect(
      cartPage.quantityOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveValue("1");
    await expect(cartPage.total).toHaveText(cartTotalLabel(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
  });

  test("TC-CART-14: Invalid quantity values are rejected", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();
    const row = cartPage.rowFor(HEELS.name);

    // Steps 2-5: "abc", "-1", "2.5" and an empty value
    for (const invalidValue of INVALID_QUANTITIES) {
      await test.step(`Quantity "${invalidValue}" is rejected`, async () => {
        await cartPage.setQuantity(row, invalidValue);
        await cartPage.update();

        await expect(page).toHaveURL("/cart");
        await expect(cartPage.quantityOf(row)).toHaveValue("1");
        await expect(cartPage.lineTotalOf(row)).toHaveText(formatMoney(price));
        await expect(cartPage.total).toHaveText(cartTotalLabel(price));
        await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
      });
    }
  });

  test("TC-CART-15: Very large quantity", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, String(LARGE_QUANTITY));
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue(String(LARGE_QUANTITY));
    await expect(cartPage.lineTotalOf(row)).toHaveText(
      formatMoney(price * LARGE_QUANTITY),
    );
    await expect(navigationPage.cartLink).toHaveText(
      cartCountLabel(LARGE_QUANTITY),
    );
    await expect(page).toHaveURL("/cart");
    await expect(cartPage.total).toHaveText(
      cartTotalLabel(price * LARGE_QUANTITY),
    );
  });

  test('TC-CART-16: Remove a line with the "x" link', async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    const priceB = await productPage.addProductToCart(SANDALS.handle);
    await cartPage.navigateToCart();

    await cartPage.remove(cartPage.rowFor(HEELS.name));

    await expect(cartPage.rowFor(HEELS.name)).toHaveCount(0);
    await expect(
      cartPage.quantityOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveValue("1");
    await expect(cartPage.total).toHaveText(cartTotalLabel(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
  });

  test("TC-CART-17: Remove the last item returns to the empty state", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();

    await cartPage.remove(cartPage.rowFor(HEELS.name));

    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.continueShoppingLink).toBeVisible();
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(0));
    await expect(cartPage.checkOutButton).toHaveCount(0);
  });

  test("TC-CART-18: Cart totals with mixed quantities and variants", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const priceHeels = await productPage.unitPrice();
    await productPage.selectSize(SIZES.medium);
    await productPage.addToCart(2);
    await productPage.selectSize(SIZES.large);
    await productPage.addToCart();
    const priceTop = await productPage.addProductToCart(TOP.handle);
    await cartPage.navigateToCart();

    const rowM = cartPage.rowFor(`${HEELS.name} - ${SIZES.medium}`);
    const rowL = cartPage.rowFor(`${HEELS.name} - ${SIZES.large}`);
    const rowTop = cartPage.rowFor(TOP.name);
    await expect(cartPage.rows).toHaveCount(3);
    await expect(cartPage.quantityOf(rowM)).toHaveValue("2");
    await expect(cartPage.quantityOf(rowL)).toHaveValue("1");
    await expect(cartPage.quantityOf(rowTop)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(rowM)).toHaveText(
      formatMoney(priceHeels * 2),
    );
    await expect(cartPage.lineTotalOf(rowL)).toHaveText(
      formatMoney(priceHeels),
    );
    await expect(cartPage.lineTotalOf(rowTop)).toHaveText(
      formatMoney(priceTop),
    );
    await expect(cartPage.total).toHaveText(
      cartTotalLabel(priceHeels * 3 + priceTop),
    );
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(4));
  });

  test("TC-CART-19: Proceed to checkout from the cart", async ({
    page,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();

    await cartPage.checkOut();

    await expect(page).toHaveURL(/\/checkouts\//);
    await expect(checkoutPage.contactSection).toBeVisible();
    await expect(checkoutPage.emailField).toBeVisible();
    await expect(checkoutPage.deliverySection).toBeVisible();
    await expect(checkoutPage.countrySelect).toBeVisible();
  });

  test("TC-CART-20: Checkout page shows the cart contents", async ({
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1
    await productPage.addProductToCart(HEELS.handle, 2);
    await productPage.addProductToCart(SANDALS.handle);

    // Step 2: note products, quantities and the cart total
    await cartPage.navigateToCart();
    const cartRowA = cartPage.rowFor(HEELS.name);
    const cartRowB = cartPage.rowFor(SANDALS.name);
    const variantA = (await cartPage.titleOf(cartRowA).innerText())
      .split(" - ")[1]
      .trim();
    const lineTotalA = await cartPage.lineTotalOf(cartRowA).innerText();
    const lineTotalB = await cartPage.lineTotalOf(cartRowB).innerText();
    const cartTotalText = await cartPage.total.innerText();

    // Steps 3-4
    await cartPage.checkOut();
    const summaryRowA = checkoutPage.orderSummaryRowFor(HEELS.name);
    const summaryRowB = checkoutPage.orderSummaryRowFor(SANDALS.name);

    await expect(summaryRowA).toContainText(variantA);
    await expect(checkoutPage.quantityCellOf(summaryRowA)).toHaveAccessibleName(
      "Quantity 2",
    );
    await expect(checkoutPage.quantityCellOf(summaryRowB)).toHaveAccessibleName(
      "Quantity 1",
    );
    await expect(summaryRowA).toContainText(lineTotalA);
    await expect(summaryRowB).toContainText(lineTotalB);

    // The summary total vs the cart total is open question 5: record only
    test.info().annotations.push({
      type: "observed",
      description: `cart: ${cartTotalText}; checkout: ${await checkoutPage.totalRow.innerText()}`,
    });
  });

  test("TC-CART-21: Header Check Out link", async ({
    page,
    productPage,
    navigationPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);

    await navigationPage.clickHeaderCheckOut();

    // Observed behaviour: the shopper ends up on the cart page
    await expect(page).toHaveURL("/cart");
  });

  test("TC-CART-22: Return from checkout to the cart keeps the items", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.addProductToCart(HEELS.handle);
    await cartPage.navigateToCart();
    await cartPage.checkOut();

    await page.goBack();

    await expect(page).toHaveURL("/cart");
    await expect(cartPage.quantityOf(cartPage.rowFor(HEELS.name))).toHaveValue(
      "1",
    );
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
  });

  test("TC-CART-23: Checkout with an empty cart", async ({
    page,
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.navigateToCart();
    await expect(cartPage.checkOutButton).toHaveCount(0);

    await checkoutPage.navigateToCheckout();

    // Observed behaviour: the shopper is sent to the home page
    await expect(page).toHaveURL("/");
    await expect(checkoutPage.orderSummaryRows).toHaveCount(0);
  });

  test("TC-CART-24: End-to-end shopper flow from catalog to checkout", async ({
    page,
    homePage,
    catalogPage,
    productPage,
    navigationPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1
    await homePage.navigateToHomePage();
    await navigationPage.openCatalog();

    // Steps 2-3
    await catalogPage.openProduct(HEELS.name);
    const priceA = await productPage.unitPrice();
    await productPage.addToCart();
    await navigationPage.openCatalog();
    await catalogPage.openProduct(SANDALS.name);
    await productPage.addToCart();

    // Step 4 (the header "My Cart" link is href="#", so open /cart directly)
    await cartPage.navigateToCart();
    const rowA = cartPage.rowFor(HEELS.name);
    const rowB = cartPage.rowFor(SANDALS.name);
    await expect(cartPage.quantityOf(rowA)).toHaveValue("1");
    await expect(cartPage.quantityOf(rowB)).toHaveValue("1");
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(2));

    // Step 5
    await cartPage.setQuantity(rowA, "2");
    await cartPage.update();
    await expect(cartPage.quantityOf(rowA)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(rowA)).toHaveText(
      formatMoney(priceA * 2),
    );
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(3));

    // Step 6
    await cartPage.remove(rowB);
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.total).toHaveText(cartTotalLabel(priceA * 2));

    // Step 7
    await cartPage.checkOut();
    await expect(page).toHaveURL(/\/checkouts\//);
    await expect(checkoutPage.contactSection).toBeVisible();
    await expect(checkoutPage.deliverySection).toBeVisible();
    await expect(
      checkoutPage.quantityCellOf(checkoutPage.orderSummaryRowFor(HEELS.name)),
    ).toHaveAccessibleName("Quantity 2");
  });
});
