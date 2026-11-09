import { BasePage } from "@pages/basePage";

export class LoginPage extends BasePage {
  public readonly heading = this.page.getByRole("heading", {
    name: "Customer Login",
  });
  // The breadcrumb has no role or accessible name; "Home" also exists in the main nav.
  public readonly breadcrumb = this.page.locator("#breadcrumb");
  public readonly emailInput = this.page.getByRole("textbox", {
    name: "Email Address",
  });
  // A password input has no ARIA role, so the label is used
  public readonly passwordInput = this.page.getByLabel("Password", {
    exact: true,
  });
  public readonly signInButton = this.page.getByRole("button", {
    name: "Sign In",
  });
  public readonly forgotPasswordLink = this.page.getByRole("link", {
    name: "Forgot your password?",
  });
  // The link only exists in the mobile menu of the sidebar and is hidden on desktop
  public readonly createAccountLink = this.page.getByRole("link", {
    name: "Create account",
    exact: true,
  });
  // The error box has no role or accessible name in the markup, so CSS is used
  public readonly errorMessage = this.page.locator("#customer_login .errors");

  // Reset Password section. Its container has no role or name, so CSS is used.
  // The reset email input has no accessible name (label and input ids differ).
  private readonly resetSection = this.page.locator("#recover-password");
  public readonly resetHeading = this.resetSection.getByRole("heading", {
    name: "Reset Password",
  });
  public readonly resetEmailInput = this.resetSection.getByRole("textbox");
  public readonly resetInstructions = this.resetSection.getByText(
    "We will send you an email to reset your password.",
  );
  public readonly resetSubmitButton = this.resetSection.getByRole("button", {
    name: "Submit",
  });
  public readonly resetCancelLink = this.resetSection.getByRole("link", {
    name: "Cancel",
  });

  async navigateToLoginPage() {
    await this.navigateTo("/account/login");
  }

  async fillEmail(email: string) {
    await this.fillIn(this.emailInput, email);
  }

  async fillPassword(password: string) {
    await this.fillIn(this.passwordInput, password);
  }

  async submit() {
    await this.clickOn(this.signInButton);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async clickForgotPassword() {
    await this.clickOn(this.forgotPasswordLink);
  }

  async cancelReset() {
    await this.clickOn(this.resetCancelLink);
  }

  async fillResetEmail(email: string) {
    await this.fillIn(this.resetEmailInput, email);
  }

  async submitReset() {
    await this.clickOn(this.resetSubmitButton);
  }

  async clickCreateAccount() {
    await this.clickOn(this.createAccountLink);
  }

  // The browser's own validation text for the email field ("" when it is valid)
  emailValidationMessage() {
    return this.emailInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage,
    );
  }
}
