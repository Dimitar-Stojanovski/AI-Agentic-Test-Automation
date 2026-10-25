# Add to cart test cases

## Notes

**Scope:** Adding products to the cart from the product page, cart management (view, quantity update, remove, totals, header count) and reaching the checkout page via the Checkout button. Out of scope: anything entered or submitted on checkout (contact, shipping, payment, order completion).

**Assumptions:** Each test starts with a new browser session and an empty cart. "In-stock product" means any product whose product page shows an enabled "Add to Cart" button. No login is needed, so no accounts are created.

**Live-page observations:**

- Product pages show title, price, and, for products with options, Size and Color dropdowns. Products with a single option (for example the jackets) show a single dropdown that repeats the product name.
- Clicking "Add to Cart" keeps the shopper on the product page. There is no confirmation message and no redirect. The only visible feedback is the header counter "My Cart (n)", which counts total units, not distinct lines.
- Sold-out products show a disabled button labelled "Sold Out". The "SOLD OUT" marker in the catalog list is a separate indicator, so check each product's own page.
- The cart shows one row per variant, with description, unit price, quantity box, line total and an "x" remove link. It also has "Update", "Check Out", "Continue Shopping" and a cart "Total". The header has a second "Check Out" link.
- Quantity update ignores non-numeric, negative, decimal and empty values, and the cart stays unchanged with no error message. A quantity of 0 removes the line. A very large quantity (99999) is accepted with no limit.
- The cart "Check Out" button leads to a Shopify-hosted checkout page (`/checkouts/...`) with a Contact section (Email), a Delivery section (Country/Region) and the order summary.
- The header "Check Out" link on the cart page led back to `/cart` and did not reach checkout in one run (see open questions).
- No CAPTCHA or bot wall was seen.

**Open questions:**

1. Is there a maximum quantity per line or per cart? Accepting 99999 may be intended or a defect.
2. Should invalid quantities (letters, negative, decimal, empty) show an error message? Currently they are silently ignored.
3. What should the header "Check Out" link do? On the cart page it reloaded `/cart`.
4. What should happen when checkout is opened with an empty cart (no checkout page was reached in one run)? Expected result is "observed behaviour to be confirmed".
5. Are shipping, tax and discounts shown on the cart? None are shown today.
6. Is there an inventory limit for in-stock items? Not known.

**Suspected defects / observations to confirm:**

- No feedback on a successful add to cart (only the header counter changes).
- No validation message for invalid quantities.
- No upper limit on quantity.
- Header "Check Out" on the cart page does not reach checkout.

**Blockers:** None.

## Test cases

### TC-CART-01: Add an in-stock product with default options

**Description:** Verifies that a shopper can add a product from its product page and see it in the cart.
**Priority:** P1

**Steps:**

1. Open the catalog page.
2. Open the product page of an in-stock product.
3. Note the product title and the price shown.
4. Click "Add to Cart".
5. Open the cart page.

**Expected results:**

- After step 4 the shopper stays on the product page and the header counter changes from "My Cart (0)" to "My Cart (1)".
- The cart contains one row with the same product title and unit price noted in step 3, quantity 1.
- The row total and the cart "Total" equal the unit price.

### TC-CART-02: Add a product with a chosen size and color

**Description:** Verifies that the selected variant is the one placed in the cart.
**Priority:** P1

**Steps:**

1. Open the product page of an in-stock product that has Size and Color dropdowns.
2. Select the size "M".
3. Click "Add to Cart".
4. Open the cart page.

**Expected results:**

- The cart row description shows the selected variant (size M and the color) next to the product title.
- Quantity is 1 and the price matches the product page.

### TC-CART-03: Add the same variant twice increases the quantity

**Description:** Verifies that repeated adds of one variant merge into one cart row.
**Priority:** P1

**Steps:**

1. Open the product page of an in-stock product.
2. Click "Add to Cart".
3. Click "Add to Cart" again.
4. Open the cart page.

**Expected results:**

- The header counter shows "My Cart (2)".
- The cart has one row for the product with quantity 2.
- The row total is twice the unit price and the cart "Total" equals the row total.

### TC-CART-04: Different variants of one product create separate rows

**Description:** Verifies that variants are tracked separately.
**Priority:** P2

**Steps:**

1. Open the product page of an in-stock product with a Size dropdown.
2. Select size "M" and click "Add to Cart".
3. Select size "L" and click "Add to Cart".
4. Open the cart page.

**Expected results:**

- The cart has two rows for the product, one for size M and one for size L, each with quantity 1.
- The header counter shows "My Cart (2)".
- The cart "Total" is the sum of both row totals.

### TC-CART-05: Add several different products

**Description:** End-to-end check of a multi-product cart with correct totals.
**Priority:** P1

**Steps:**

1. Open the product page of an in-stock product (product A) and click "Add to Cart".
2. Open the product page of a different in-stock product (product B) and click "Add to Cart".
3. Open the cart page.

**Expected results:**

- The cart has one row each for A and B, with the unit price shown on each product page.
- The header counter shows "My Cart (2)".
- The cart "Total" equals the sum of the two row totals.

### TC-CART-06: Sold-out product cannot be added

**Description:** Verifies that a sold-out product is blocked from the cart.
**Priority:** P1

**Steps:**

1. Open the catalog page and find a product marked "SOLD OUT".
2. Open that product's page.
3. Try to click the button labelled "Sold Out".
4. Open the cart page.

**Expected results:**

- The button reads "Sold Out" and is disabled (greyed out).
- Clicking it does nothing, and the header counter stays "My Cart (0)".
- The cart shows "It appears that your cart is currently empty!".

### TC-CART-07: Cart contents and header counter persist across pages

**Description:** Verifies that the cart survives navigation and a reload.
**Priority:** P2

**Steps:**

1. Add an in-stock product to the cart.
2. Open the home page, then the catalog page, then the About Us page.
3. Reload the browser page.
4. Open the cart page.

**Expected results:**

- The header shows "My Cart (1)" on every page visited, including after the reload.
- The cart still shows the product with quantity 1.

### TC-CART-08: Empty cart state

**Description:** Verifies the empty cart message and navigation back to shopping.
**Priority:** P1

**Steps:**

1. In a new session, open the cart page.
2. Click "Continue Shopping".

**Expected results:**

- After step 1 the page shows "It appears that your cart is currently empty!" and a "Continue Shopping" link. No line items, "Update" button or "Check Out" button is shown.
- The header counter shows "My Cart (0)".
- After step 2 the shopper lands on the catalog page.

### TC-CART-09: Continue Shopping from a cart with items

**Description:** Verifies that the cart keeps its items when the shopper goes back to browse.
**Priority:** P3

**Steps:**

1. Add an in-stock product to the cart and open the cart page.
2. Click "Continue Shopping".
3. Open the cart page again.

**Expected results:**

- After step 2 the shopper lands on the catalog page.
- After step 3 the cart still contains the product with quantity 1.

### TC-CART-10: Increase quantity and update

**Description:** Verifies that line total, cart total and header counter follow a quantity change.
**Priority:** P1

**Steps:**

1. Add an in-stock product to the cart and open the cart page.
2. Change the quantity box to 3.
3. Click "Update".

**Expected results:**

- The quantity shows 3.
- The row total is three times the unit price and the cart "Total" matches it.
- The header counter shows "My Cart (3)".

### TC-CART-11: Decrease quantity and update

**Description:** Verifies reducing a quantity.
**Priority:** P2

**Steps:**

1. Add the same in-stock product to the cart three times and open the cart page.
2. Change the quantity box to 1.
3. Click "Update".

**Expected results:**

- The quantity shows 1.
- The row total equals the unit price and the cart "Total" matches it.
- The header counter shows "My Cart (1)".

### TC-CART-12: Update one line in a multi-product cart

**Description:** Verifies that a quantity change affects only its own line while totals are recalculated.
**Priority:** P2

**Steps:**

1. Add two different in-stock products (A and B) to the cart and open the cart page.
2. Set the quantity of A to 2 and leave B at 1.
3. Click "Update".

**Expected results:**

- A shows quantity 2 and a row total of twice its unit price.
- B is unchanged at quantity 1.
- The cart "Total" equals A's row total plus B's row total.
- The header counter shows "My Cart (3)".

### TC-CART-13: Quantity set to 0 removes the line

**Description:** Boundary check: quantity 0 should remove the item.
**Priority:** P2

**Steps:**

1. Add two different in-stock products to the cart and open the cart page.
2. Set the quantity of the first product to 0.
3. Click "Update".

**Expected results:**

- The first product's row is no longer in the cart.
- The other product remains with its quantity.
- The cart "Total" equals the remaining row total and the header counter decreases accordingly.

### TC-CART-14: Invalid quantity values are rejected

**Description:** Error guessing: non-numeric, negative, decimal and empty quantities must not corrupt the cart.
**Priority:** P2

**Steps:**

1. Add an in-stock product to the cart and open the cart page.
2. Enter "abc" in the quantity box and click "Update".
3. Enter "-1" in the quantity box and click "Update".
4. Enter "2.5" in the quantity box and click "Update".
5. Clear the quantity box and click "Update".

**Expected results:**

- After each of steps 2 to 5 the cart shows no negative, fractional or blank quantity, and no error page.
- The quantity, row total, cart "Total" and header counter match the quantity before the change (observed behaviour: the invalid value is ignored with no message; to be confirmed, see open question 2).

### TC-CART-15: Very large quantity

**Description:** Boundary check for an unusually high quantity. The business limit is unknown.
**Priority:** P3

**Steps:**

1. Add an in-stock product to the cart and open the cart page.
2. Enter 99999 in the quantity box and click "Update".

**Expected results:**

- Observed behaviour to be confirmed (see open question 1). Observed so far: the quantity is accepted, the row total is 99999 times the unit price, and the header counter shows the new total of units.
- The page still renders without error and the figures are consistent with each other.

### TC-CART-16: Remove a line with the "x" link

**Description:** Verifies removing one item from a multi-item cart.
**Priority:** P1

**Steps:**

1. Add two different in-stock products (A and B) to the cart and open the cart page.
2. Click the "x" link on A's row.

**Expected results:**

- A's row is removed and B remains with its quantity.
- The cart "Total" equals B's row total.
- The header counter shows B's quantity only.

### TC-CART-17: Remove the last item returns to the empty state

**Description:** Verifies the transition from a cart with items to an empty cart.
**Priority:** P1

**Steps:**

1. Add one in-stock product to the cart and open the cart page.
2. Click the "x" link on its row.

**Expected results:**

- The page shows "It appears that your cart is currently empty!" with a "Continue Shopping" link.
- The header counter shows "My Cart (0)".
- No "Check Out" button is shown.

### TC-CART-18: Cart totals with mixed quantities and variants

**Description:** Verifies the arithmetic of the cart total across several lines.
**Priority:** P2

**Steps:**

1. Add size M of an in-stock product with sizes twice.
2. Add size L of the same product once.
3. Add a different in-stock product once.
4. Open the cart page.

**Expected results:**

- There are three rows with quantities 2, 1 and 1.
- Each row total equals unit price multiplied by quantity.
- The cart "Total" equals the sum of the three row totals, in GBP (£) with two decimals.
- The header counter shows "My Cart (4)".

### TC-CART-19: Proceed to checkout from the cart

**Description:** Verifies that the cart "Check Out" button leads to the checkout page.
**Priority:** P1

**Steps:**

1. Add an in-stock product to the cart and open the cart page.
2. Click the "Check Out" button below the cart "Total".

**Expected results:**

- The shopper lands on the Shopify-hosted checkout page (the address contains `/checkouts/`).
- The page shows a Contact section with an Email field and a Delivery section with a Country/Region selector.
- The checkout is not submitted: do not enter or submit any details.

### TC-CART-20: Checkout page shows the cart contents

**Description:** Verifies that the checkout order summary matches the cart.
**Priority:** P1

**Steps:**

1. Add an in-stock product twice and a different in-stock product once.
2. Open the cart page and note each product, quantity and the cart "Total".
3. Click "Check Out".
4. Look at the order summary on the checkout page.

**Expected results:**

- The summary lists the same products, variants and quantities as the cart.
- The line prices match the cart. Whether the summary total equals the cart "Total" depends on shipping and tax, which are open question 5, so record the observed figures.

### TC-CART-21: Header Check Out link

**Description:** Verifies the behaviour of the second "Check Out" link in the page header.
**Priority:** P3

**Steps:**

1. Add an in-stock product to the cart.
2. Click the "Check Out" link in the page header.

**Expected results:**

- Observed behaviour to be confirmed (open question 3). Observed so far: the shopper ends up on the cart page, not on checkout.

### TC-CART-22: Return from checkout to the cart keeps the items

**Description:** Verifies that leaving checkout does not lose the cart.
**Priority:** P2

**Steps:**

1. Add an in-stock product to the cart, open the cart page and click "Check Out".
2. On the checkout page, use the browser Back button.

**Expected results:**

- The shopper returns to the cart page.
- The product is still in the cart with the same quantity and the header counter is unchanged.

### TC-CART-23: Checkout with an empty cart

**Description:** Verifies that checkout cannot be reached with nothing in the cart.
**Priority:** P3

**Steps:**

1. In a new session, open the cart page.
2. Check which checkout controls are visible.
3. Open `/checkout` directly in the address bar.

**Expected results:**

- The empty cart page shows no "Check Out" button.
- Direct access to `/checkout` shows observed behaviour to be confirmed (open question 4). No order summary with items is displayed.

### TC-CART-24: End-to-end shopper flow from catalog to checkout

**Description:** Realistic flow combining browsing, add, update, remove and checkout.
**Priority:** P1

**Steps:**

1. Open the home page and click "Catalog".
2. Open an in-stock product (A) and click "Add to Cart".
3. Return to the catalog, open a second in-stock product (B) and click "Add to Cart".
4. Open the cart page from the "My Cart" link in the header.
5. Set the quantity of A to 2 and click "Update".
6. Click the "x" link on B's row.
7. Click "Check Out".

**Expected results:**

- After step 4 the cart shows A and B with quantity 1 each and the header shows "My Cart (2)".
- After step 5 A shows quantity 2, its row total is twice its unit price, and the header shows "My Cart (3)".
- After step 6 only A remains and the cart "Total" equals A's row total.
- After step 7 the shopper lands on the checkout page with the Contact and Delivery sections, and the order summary shows A with quantity 2.
