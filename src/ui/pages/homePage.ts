import { BasePage } from "@pages/basePage";

export class HomePage extends BasePage {
  // Header
  private readonly header = this.page.getByRole("banner");
  public readonly headerSearchLink = this.header.getByRole("link", {
    name: "Search",
    exact: true,
  });
  public readonly headerAboutUsLink = this.header.getByRole("link", {
    name: "About Us",
    exact: true,
  });
  public readonly headerLogInLink = this.header.getByRole("link", {
    name: "Log In",
    exact: true,
  });
  public readonly headerSignUpLink = this.header.getByRole("link", {
    name: "Sign up",
    exact: true,
  });
  public readonly cartLink = this.header.getByRole("link", {
    name: "My Cart (0)",
  });
  public readonly checkOutLink = this.header.getByRole("link", {
    name: "Check Out",
    exact: true,
  });

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

  // Sidebar menu
  private readonly sidebar = this.page
    .getByRole("navigation")
    .filter({ has: this.page.getByRole("link", { name: "Catalog" }) });
  public readonly menuItems = this.sidebar.getByRole("listitem");

  // Social icons: they have no text or accessible name, so CSS is the only option
  public readonly facebookIcon = this.sidebar.locator("#social a.facebook");
  public readonly twitterIcon = this.sidebar.locator("#social a.twitter");
  public readonly instagramIcon = this.sidebar.locator("#social a.instagram");
  public readonly pinterestIcon = this.sidebar.locator("#social a.pinterest");
  public readonly rssIcon = this.sidebar.locator("#social a.rss");

  // Featured products
  public readonly productTiles = this.page
    .getByRole("link")
    .filter({ has: this.page.getByRole("heading", { level: 3 }) });
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

  async navigateToHomePage() {
    return await this.page.goto("/");
  }
}
