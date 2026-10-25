import { test, expect } from "@utils/uiUtils/uiFixtures";
import type { ProductPage } from "@pages/productPage";

// Product handles are the only catalog data used. Prices are read from the
// product pages, never hardcoded.
const HEELS = { handle: "flower-print-jeans", name: "Black heels" };
const SANDALS = { handle: "bronze-sandals", name: "Bronze sandals" };
const TOP = { handle: "striped-top", name: "Striped top" };

const toNumber = (text: string) => Number(text.replace(/[^0-9.]/g, ""));
const money = (amount: number) =>
  `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const cartCount = (count: number) => `My Cart (${count})`;
const cartTotal = (amount: number) => `Total ${money(amount)}`;

// Opens a product page, adds it to the cart and returns the unit price shown
const addProduct = async (
  productPage: ProductPage,
  handle: string,
  times = 1,
) => {
  await productPage.navigateToProduct(handle);
  const price = toNumber(await productPage.price.innerText());
  for (let i = 0; i < times; i++) {
    await productPage.addToCart();
  }
  return price;
};

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
    const price = toNumber(await productPage.price.innerText());

    // Step 4
    await productPage.addToCart();
    await expect(page).toHaveURL(/\/products\/flower-print-jeans/);
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));

    // Step 5
    await cartPage.navigateToCart();
    const row = cartPage.rowFor(title);
    await expect(row).toHaveCount(1);
    await expect(cartPage.unitPriceOf(row)).toHaveText(money(price));
    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(row)).toHaveText(money(price));
    await expect(cartPage.total).toHaveText(cartTotal(price));
  });

  test("TC-CART-02: Add a product with a chosen size and color", async ({
    productPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const price = toNumber(await productPage.price.innerText());
    const color = await productPage.colorDropdown.inputValue();
    await productPage.selectSize("M");
    await productPage.addToCart();
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(`${HEELS.name} - M / ${color}`);
    await expect(row).toHaveCount(1);
    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.unitPriceOf(row)).toHaveText(money(price));
  });

  test("TC-CART-03: Add the same variant twice increases the quantity", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await addProduct(productPage, HEELS.handle, 2);
    await cartPage.navigateToCart();

    await expect(navigationPage.cartLink).toHaveText(cartCount(2));
    const row = cartPage.rowFor(HEELS.name);
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.quantityOf(row)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(row)).toHaveText(money(price * 2));
    await expect(cartPage.total).toHaveText(cartTotal(price * 2));
  });

  test("TC-CART-04: Different variants of one product create separate rows", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const price = toNumber(await productPage.price.innerText());
    await productPage.selectSize("M");
    await productPage.addToCart();
    await productPage.selectSize("L");
    await productPage.addToCart();
    await cartPage.navigateToCart();

    const rowM = cartPage.rowFor(`${HEELS.name} - M`);
    const rowL = cartPage.rowFor(`${HEELS.name} - L`);
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.quantityOf(rowM)).toHaveValue("1");
    await expect(cartPage.quantityOf(rowL)).toHaveValue("1");
    await expect(navigationPage.cartLink).toHaveText(cartCount(2));
    await expect(cartPage.total).toHaveText(cartTotal(price * 2));
  });

  test("TC-CART-05: Add several different products", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const priceA = await addProduct(productPage, HEELS.handle);
    const priceB = await addProduct(productPage, SANDALS.handle);
    await cartPage.navigateToCart();

    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.unitPriceOf(cartPage.rowFor(HEELS.name))).toHaveText(
      money(priceA),
    );
    await expect(
      cartPage.unitPriceOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveText(money(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCount(2));
    await expect(cartPage.total).toHaveText(cartTotal(priceA + priceB));
  });

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
    await expect(navigationPage.cartLink).toHaveText(cartCount(0));

    await cartPage.navigateToCart();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test("TC-CART-07: Cart contents and header counter persist across pages", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await addProduct(productPage, HEELS.handle);

    await navigationPage.openHome();
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
    await navigationPage.openCatalog();
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
    await navigationPage.openAboutUs();
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));

    await page.reload();
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));

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
    await expect(navigationPage.cartLink).toHaveText(cartCount(0));

    await cartPage.clickContinueShopping();
    await expect(page).toHaveURL("/collections/all");
  });

  test("TC-CART-09: Continue Shopping from a cart with items", async ({
    page,
    productPage,
    cartPage,
  }) => {
    await addProduct(productPage, HEELS.handle);
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
    const price = await addProduct(productPage, HEELS.handle);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, "3");
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue("3");
    await expect(cartPage.lineTotalOf(row)).toHaveText(money(price * 3));
    await expect(cartPage.total).toHaveText(cartTotal(price * 3));
    await expect(navigationPage.cartLink).toHaveText(cartCount(3));
  });

  test("TC-CART-11: Decrease quantity and update", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await addProduct(productPage, HEELS.handle, 3);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, "1");
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(row)).toHaveText(money(price));
    await expect(cartPage.total).toHaveText(cartTotal(price));
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
  });

  test("TC-CART-12: Update one line in a multi-product cart", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const priceA = await addProduct(productPage, HEELS.handle);
    const priceB = await addProduct(productPage, SANDALS.handle);
    await cartPage.navigateToCart();

    const rowA = cartPage.rowFor(HEELS.name);
    const rowB = cartPage.rowFor(SANDALS.name);
    await cartPage.setQuantity(rowA, "2");
    await cartPage.update();

    await expect(cartPage.quantityOf(rowA)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(rowA)).toHaveText(money(priceA * 2));
    await expect(cartPage.quantityOf(rowB)).toHaveValue("1");
    await expect(cartPage.total).toHaveText(cartTotal(priceA * 2 + priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCount(3));
  });

  test("TC-CART-13: Quantity set to 0 removes the line", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await addProduct(productPage, HEELS.handle);
    const priceB = await addProduct(productPage, SANDALS.handle);
    await cartPage.navigateToCart();

    await cartPage.setQuantity(cartPage.rowFor(HEELS.name), "0");
    await cartPage.update();

    await expect(cartPage.rowFor(HEELS.name)).toHaveCount(0);
    await expect(
      cartPage.quantityOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveValue("1");
    await expect(cartPage.total).toHaveText(cartTotal(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
  });

  test("TC-CART-14: Invalid quantity values are rejected", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await addProduct(productPage, HEELS.handle);
    await cartPage.navigateToCart();
    const row = cartPage.rowFor(HEELS.name);

    // Steps 2-5: "abc", "-1", "2.5" and an empty value
    for (const invalidValue of ["abc", "-1", "2.5", ""]) {
      await cartPage.setQuantity(row, invalidValue);
      await cartPage.update();

      await expect(page).toHaveURL("/cart");
      await expect(cartPage.quantityOf(row)).toHaveValue("1");
      await expect(cartPage.lineTotalOf(row)).toHaveText(money(price));
      await expect(cartPage.total).toHaveText(cartTotal(price));
      await expect(navigationPage.cartLink).toHaveText(cartCount(1));
    }
  });

  test("TC-CART-15: Very large quantity", async ({
    page,
    productPage,
    navigationPage,
    cartPage,
  }) => {
    const price = await addProduct(productPage, HEELS.handle);
    await cartPage.navigateToCart();

    const row = cartPage.rowFor(HEELS.name);
    await cartPage.setQuantity(row, "99999");
    await cartPage.update();

    await expect(cartPage.quantityOf(row)).toHaveValue("99999");
    await expect(cartPage.lineTotalOf(row)).toHaveText(money(price * 99999));
    await expect(navigationPage.cartLink).toHaveText(cartCount(99999));
    await expect(page).toHaveURL("/cart");
    await expect(cartPage.total).toHaveText(cartTotal(price * 99999));
  });

  test('TC-CART-16: Remove a line with the "x" link', async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await addProduct(productPage, HEELS.handle);
    const priceB = await addProduct(productPage, SANDALS.handle);
    await cartPage.navigateToCart();

    await cartPage.remove(cartPage.rowFor(HEELS.name));

    await expect(cartPage.rowFor(HEELS.name)).toHaveCount(0);
    await expect(
      cartPage.quantityOf(cartPage.rowFor(SANDALS.name)),
    ).toHaveValue("1");
    await expect(cartPage.total).toHaveText(cartTotal(priceB));
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
  });

  test("TC-CART-17: Remove the last item returns to the empty state", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await addProduct(productPage, HEELS.handle);
    await cartPage.navigateToCart();

    await cartPage.remove(cartPage.rowFor(HEELS.name));

    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.continueShoppingLink).toBeVisible();
    await expect(navigationPage.cartLink).toHaveText(cartCount(0));
    await expect(cartPage.checkOutButton).toHaveCount(0);
  });

  test("TC-CART-18: Cart totals with mixed quantities and variants", async ({
    productPage,
    navigationPage,
    cartPage,
  }) => {
    await productPage.navigateToProduct(HEELS.handle);
    const priceHeels = toNumber(await productPage.price.innerText());
    await productPage.selectSize("M");
    await productPage.addToCart();
    await productPage.addToCart();
    await productPage.selectSize("L");
    await productPage.addToCart();
    const priceTop = await addProduct(productPage, TOP.handle);
    await cartPage.navigateToCart();

    const rowM = cartPage.rowFor(`${HEELS.name} - M`);
    const rowL = cartPage.rowFor(`${HEELS.name} - L`);
    const rowTop = cartPage.rowFor(TOP.name);
    await expect(cartPage.rows).toHaveCount(3);
    await expect(cartPage.quantityOf(rowM)).toHaveValue("2");
    await expect(cartPage.quantityOf(rowL)).toHaveValue("1");
    await expect(cartPage.quantityOf(rowTop)).toHaveValue("1");
    await expect(cartPage.lineTotalOf(rowM)).toHaveText(money(priceHeels * 2));
    await expect(cartPage.lineTotalOf(rowL)).toHaveText(money(priceHeels));
    await expect(cartPage.lineTotalOf(rowTop)).toHaveText(money(priceTop));
    await expect(cartPage.total).toHaveText(
      cartTotal(priceHeels * 3 + priceTop),
    );
    await expect(navigationPage.cartLink).toHaveText(cartCount(4));
  });

  test("TC-CART-19: Proceed to checkout from the cart", async ({
    page,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await addProduct(productPage, HEELS.handle);
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
    await addProduct(productPage, HEELS.handle, 2);
    await addProduct(productPage, SANDALS.handle);

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
    await addProduct(productPage, HEELS.handle);

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
    await addProduct(productPage, HEELS.handle);
    await cartPage.navigateToCart();
    await cartPage.checkOut();

    await page.goBack();

    await expect(page).toHaveURL("/cart");
    await expect(cartPage.quantityOf(cartPage.rowFor(HEELS.name))).toHaveValue(
      "1",
    );
    await expect(navigationPage.cartLink).toHaveText(cartCount(1));
  });

  test("TC-CART-23: Checkout with an empty cart", async ({
    page,
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.navigateToCart();
    await expect(cartPage.checkOutButton).toHaveCount(0);

    await page.goto("/checkout");

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
    const priceA = toNumber(await productPage.price.innerText());
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
    await expect(navigationPage.cartLink).toHaveText(cartCount(2));

    // Step 5
    await cartPage.setQuantity(rowA, "2");
    await cartPage.update();
    await expect(cartPage.quantityOf(rowA)).toHaveValue("2");
    await expect(cartPage.lineTotalOf(rowA)).toHaveText(money(priceA * 2));
    await expect(navigationPage.cartLink).toHaveText(cartCount(3));

    // Step 6
    await cartPage.remove(rowB);
    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.total).toHaveText(cartTotal(priceA * 2));

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
