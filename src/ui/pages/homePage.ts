import { BasePage } from "@pages/basePage";

export class HomePage extends BasePage {
  // The header links and the sidebar menu live in NavigationPage
  private readonly header = this.page.getByRole("banner");

  // Search box
  private readonly searchForm = this.page.getByRole("search");
  public readonly searchBox = this.searchForm.getByPlaceholder("Search");
  // The magnifier button has no accessible name, so it is found by role only
  public readonly searchButton = this.searchForm.getByRole("button");

  // Logo and tagline
  public readonly logoImage = this.header.getByRole("img", {
    name: "Sauce Demo",
  });
  public readonly logoLink = this.header
    .getByRole("heading", { level: 1 })
    .getByRole("link");
  public readonly tagline = this.header.getByRole("heading", { level: 3 });

  // Featured products
  public readonly productTiles = this.productTileLinks;
  public readonly productImages = this.productTiles.getByRole("img");
  public readonly productNames = this.productTiles.getByRole("heading", {
    level: 3,
  });
  public readonly productPrices = this.productTiles.getByRole("heading", {
    level: 4,
  });
  // The page content area has no landmark or accessible name
  public readonly contentImages = this.page
    .locator("#page-content")
    .getByRole("img");

  // Footer
  private readonly footer = this.page.getByRole("contentinfo");
  private readonly footerLinksColumn = this.footer
    .getByRole("navigation")
    .filter({ has: this.page.getByRole("heading", { name: "Footer" }) });
  public readonly footerSearchLink = this.footerLinksColumn.getByRole("link", {
    name: "Search",
    exact: true,
  });
  public readonly footerAboutUsLink = this.footerLinksColumn.getByRole("link", {
    name: "About Us",
    exact: true,
  });
  public readonly footerAboutText = this.footer.getByRole("paragraph");
  public readonly footerSauceLink = this.footerAboutText.getByRole("link", {
    name: "Sauce",
    exact: true,
  });
  public readonly cardLogos = this.footer.getByRole("img", {
    name: "We accept",
  });

  // Copyright bar
  public readonly copyrightText = this.footer.getByText("Copyright ©");
  public readonly shopifyLink = this.footer.getByRole("link", {
    name: "Shopping Cart by Shopify",
  });
  private readonly barLinks = this.footer
    .getByRole("navigation")
    .filter({ hasNot: this.page.getByRole("heading") });
  public readonly barSearchLink = this.barLinks.getByRole("link", {
    name: "Search",
    exact: true,
  });
  public readonly barAboutUsLink = this.barLinks.getByRole("link", {
    name: "About Us",
    exact: true,
  });

  navigateToHomePage() {
    return this.navigateTo("/");
  }
}
