import { BasePage } from "@pages/basePage";
import type { Locator } from "@playwright/test";

export class CartPage extends BasePage {
  // The cart rows are plain divs without roles, so CSS is the only option.
  // The markup also holds hidden duplicates of the rows and the Total row.
  // Only the visible rows with a quantity box are real cart lines.
  public readonly rows = this.page
    .locator("form[action='/cart'] .row")
    .filter({ has: this.page.getByRole("textbox") });
  public readonly emptyMessage = this.page.getByText(
    "It appears that your cart is currently empty!",
  );
  public readonly continueShoppingLink = this.page.getByRole("link", {
    name: "Continue Shopping",
  });
  public readonly updateButton = this.page.getByRole("button", {
    name: "Update",
  });
  public readonly checkOutButton = this.page.getByRole("button", {
    name: "Check Out",
  });
  public readonly total = this.page.getByRole("heading", {
    level: 2,
    name: /^Total/,
  });

  async navigateToCart() {
    await this.navigateTo("/cart");
  }

  rowFor(title: string) {
    return this.rows.filter({
      has: this.page.getByRole("link", { name: title }),
    });
  }

  // The price and total cells have no role or label, so CSS classes are used
  unitPriceOf(row: Locator) {
    return row.locator(".price");
  }

  lineTotalOf(row: Locator) {
    return row.locator(".total");
  }

  titleOf(row: Locator) {
    return row.getByRole("heading", { level: 3 }).getByRole("link");
  }

  quantityOf(row: Locator) {
    return row.getByRole("textbox");
  }

  removeLinkOf(row: Locator) {
    return row.getByRole("link", { name: "x", exact: true });
  }

  async setQuantity(row: Locator, quantity: string) {
    await this.fillIn(this.quantityOf(row), quantity);
  }

  async update() {
    // The update posts the form and reloads the cart page
    const updated = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === "/cart",
    );
    await this.clickOn(this.updateButton);
    await updated;
  }

  async remove(row: Locator) {
    await this.clickOn(this.removeLinkOf(row));
  }

  async clickContinueShopping() {
    await this.clickOn(this.continueShoppingLink);
  }

  async checkOut() {
    await this.clickOn(this.checkOutButton);
  }
}
