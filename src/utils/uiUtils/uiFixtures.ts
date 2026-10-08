import { test as base } from "@playwright/test";
import { LoginPage } from "@pages/loginPage";
import { RegisterPage } from "@pages/registerPage";

type UiFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from "@playwright/test";
