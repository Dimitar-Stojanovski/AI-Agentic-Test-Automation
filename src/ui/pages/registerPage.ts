import { BasePage } from "@pages/basePage";
import type { Locator } from "@playwright/test";
import type { UserDetails } from "@utils/testData/users";

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
  private readonly breadcrumbHomeLink = this.breadcrumb.getByRole("link", {
    name: "Home",
  });

  async navigateToRegisterPage() {
    await this.navigateTo("/account/register");
  }

  async clickBreadcrumbHome() {
    await this.clickOn(this.breadcrumbHomeLink);
  }

  async clickLabel(label: Locator) {
    await this.clickOn(label);
  }

  async focusFirstName() {
    await this.focusOn(this.firstNameInput);
  }

  async pressTab() {
    await this.page.keyboard.press("Tab");
  }

  async fillRegistrationForm(details: Partial<UserDetails>) {
    const fields = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      email: this.emailInput,
      password: this.passwordInput,
    };
    for (const [name, value] of Object.entries(details)) {
      await this.fillIn(fields[name as keyof typeof fields], value);
    }
  }

  // The browser's own validation text for the email field ("" when it is valid)
  emailValidationMessage() {
    return this.emailInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage,
    );
  }

  async submit() {
    await this.clickOn(this.createButton);
  }

  async submitWithEnter() {
    await this.pressKey(this.passwordInput, "Enter");
  }
}
