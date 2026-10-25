import { BasePage } from "@pages/basePage";

export class RegisterPage extends BasePage {
  public readonly heading = this.page.getByRole("heading", {
    name: "Create Account",
  });
  // The breadcrumb has no role or accessible name; "Home" also exists in the main nav.
  public readonly breadcrumb = this.page.locator("#breadcrumb");
  // Inputs share their id with the wrapping div, so labels are not associated and
  // getByLabel/getByRole(name) cannot find them. The name attribute is the stable option.
  public readonly firstNameInput = this.page.locator(
    'input[name="customer[first_name]"]',
  );
  public readonly lastNameInput = this.page.locator(
    'input[name="customer[last_name]"]',
  );
  public readonly emailInput = this.page.locator(
    'input[name="customer[email]"]',
  );
  public readonly passwordInput = this.page.locator(
    'input[name="customer[password]"]',
  );
  public readonly createButton = this.page.getByRole("button", {
    name: "Create",
  });
  public readonly firstNameLabel = this.page.getByText("First Name", {
    exact: true,
  });
  public readonly lastNameLabel = this.page.getByText("Last Name", {
    exact: true,
  });
  public readonly emailLabel = this.page.getByText("Email Address", {
    exact: true,
  });
  public readonly passwordLabel = this.page.getByText("Password", {
    exact: true,
  });
  // Product tiles are unnamed links with no role-level grouping; the frontpage
  // collection is only identifiable by the href of its product links.
  public readonly frontpageProductLinks = this.page.locator(
    'a[href^="/collections/frontpage/products/"]',
  );
  private readonly headerSignUpLink = this.page.getByRole("link", {
    name: "Sign up",
  });
  private readonly breadcrumbHomeLink = this.breadcrumb.getByRole("link", {
    name: "Home",
  });

  async navigateToRegisterPage() {
    await this.page.goto("/account/register");
  }

  async navigateToHomePage() {
    await this.page.goto("/");
  }

  async clickHeaderSignUp() {
    await this.clickOn(this.headerSignUpLink);
  }

  async clickBreadcrumbHome() {
    await this.clickOn(this.breadcrumbHomeLink);
  }

  async fillRegistrationForm(details: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }) {
    if (details.firstName !== undefined) {
      await this.fillIn(this.firstNameInput, details.firstName);
    }
    if (details.lastName !== undefined) {
      await this.fillIn(this.lastNameInput, details.lastName);
    }
    if (details.email !== undefined) {
      await this.fillIn(this.emailInput, details.email);
    }
    if (details.password !== undefined) {
      await this.fillIn(this.passwordInput, details.password);
    }
  }

  async submit() {
    await this.clickOn(this.createButton);
  }
}
