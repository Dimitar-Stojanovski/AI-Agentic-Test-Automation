import { BasePage } from "@pages/basePage";
import { parsePrice } from "@utils/formatters";

export class ProductPage extends BasePage {
  // The logo is also a level 1 heading, but it contains an image
  public readonly title = this.page
    .getByRole("heading", { level: 1 })
    .filter({ hasNot: this.page.getByRole("img") });
  // Other level 2 headings exist in the footer, so the price is matched by its symbol
  public readonly price = this.page.getByRole("heading", {
    level: 2,
    name: /^£/,
  });
  public readonly sizeDropdown = this.page.getByRole("combobox", {
    name: "Size",
  });
  public readonly colorDropdown = this.page.getByRole("combobox", {
    name: "Color",
  });
  public readonly addToCartButton = this.page.getByRole("button", {
    name: "Add to Cart",
  });
  public readonly soldOutButton = this.page.getByRole("button", {
    name: "Sold Out",
  });

  async navigateToProduct(handle: string) {
    await this.navigateTo(`/products/${handle}`);
  }

  // The unit price shown on the page, as a number
  async unitPrice() {
    return parsePrice(await this.price.innerText());
  }

  async selectSize(size: string) {
    await this.selectFromDropdown(this.sizeDropdown, size);
  }

  async addToCart(times = 1) {
    for (let i = 0; i < times; i++) {
      // The add is an ajax call; waiting for it avoids racing the next navigation
      const added = this.page.waitForResponse((response) =>
        response.url().includes("/cart/add"),
      );
      await this.clickOn(this.addToCartButton);
      await added;
    }
  }

  // Opens a product page, adds it to the cart and returns the unit price shown
  async addProductToCart(handle: string, times = 1) {
    await this.navigateToProduct(handle);
    const price = await this.unitPrice();
    await this.addToCart(times);
    return price;
  }

  async clickSoldOut() {
    // The button is disabled, so the click is forced to try it anyway
    await this.clickOn(this.soldOutButton, { force: true });
  }
}
