import { BasePage } from "@pages/basePage";

export class NavigationPage extends BasePage {
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
  public readonly menuItems = this.sidebar.getByRole("listitem");
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

  // Social icons: they have no text or accessible name, so CSS is the only option
  public readonly facebookIcon = this.sidebar.locator("#social a.facebook");
  public readonly twitterIcon = this.sidebar.locator("#social a.twitter");
  public readonly instagramIcon = this.sidebar.locator("#social a.instagram");
  public readonly pinterestIcon = this.sidebar.locator("#social a.pinterest");
  public readonly rssIcon = this.sidebar.locator("#social a.rss");

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

  async openLogIn() {
    await this.clickOn(this.headerLogInLink);
  }

  async openSignUp() {
    await this.clickOn(this.headerSignUpLink);
  }

  async clickHeaderCheckOut() {
    await this.clickOn(this.headerCheckOutLink);
  }
}
