import { BasePage } from "./basePage";

export class RegisterPage extends BasePage {
  async navigateToRegisterPage() {
    await this.page.goto("/account/register");
  }
}
