import { BasePage } from "@pages/basePage";

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.getByRole("textbox", {
    name: "Email Address",
  });
  private readonly passwordInput = this.page.getByRole("textbox", {
    name: "Password",
  });
  private readonly signInButton = this.page.getByRole("button", {
    name: "Sign In",
  });
  public readonly errorMessage = this.page.locator("#customer_login .errors");

  async navigateToLoginPage() {
    await this.page.goto("/account/login");
  }

  async login(email: string, password: string) {
    await this.fillIn(this.emailInput, email);
    await this.fillIn(this.passwordInput, password);
    await this.clickOn(this.signInButton);
  }
}
