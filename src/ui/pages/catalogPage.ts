import { BasePage } from "@pages/basePage";

export class CatalogPage extends BasePage {
  private readonly productLinks = this.productTileLinks;
  public readonly soldOutProductLinks = this.productLinks.filter({
    hasText: "Sold Out",
  });

  async navigateToCatalog() {
    await this.navigateTo("/collections/all");
  }

  async openProduct(name: string) {
    await this.clickOn(
      this.productLinks.filter({
        has: this.page.getByRole("heading", { name, exact: true }),
      }),
    );
  }

  async openFirstSoldOutProduct() {
    await this.clickOn(this.soldOutProductLinks.first());
  }
}
