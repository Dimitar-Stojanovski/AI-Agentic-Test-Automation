import { BasePage } from "@pages/basePage";

export class NavigationPage extends BasePage {
  // Header
  private readonly header = this.page.getByRole("banner");
  // The counter text changes with the cart content, so only the prefix is matched
  public readonly cartLink = this.header.getByRole("link", {
    name: /^My Cart \(\d+\)$/,
  });
  public readonly headerCheckOutLink = this.header.getByRole("link", {
    name: "Check Out",
    exact: true,
  });

  // Sidebar menu
  private readonly sidebar = this.page
    .getByRole("navigation")
    .filter({ has: this.page.getByRole("link", { name: "Catalog" }) });
  public readonly homeLink = this.sidebar.getByRole("link", {
    name: "Home",
    exact: true,
  });
  public readonly catalogLink = this.sidebar.getByRole("link", {
    name: "Catalog",
    exact: true,
  });
  public readonly aboutUsLink = this.sidebar.getByRole("link", {
    name: "About Us",
    exact: true,
  });

  async openCart() {
    await this.clickOn(this.cartLink);
  }

  async openCatalog() {
    await this.clickOn(this.catalogLink);
  }

  async openHome() {
    await this.clickOn(this.homeLink);
  }

  async openAboutUs() {
    await this.clickOn(this.aboutUsLink);
  }

  async clickHeaderCheckOut() {
    await this.clickOn(this.headerCheckOutLink);
  }
}
