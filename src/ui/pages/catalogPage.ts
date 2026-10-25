import { BasePage } from "@pages/basePage";

export class CatalogPage extends BasePage {
  private readonly productLinks = this.page
    .getByRole("link")
    .filter({ has: this.page.getByRole("heading", { level: 3 }) });
  public readonly soldOutProductLinks = this.productLinks.filter({
    hasText: "Sold Out",
  });

  async navigateToCatalog() {
    await this.page.goto("/collections/all");
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
