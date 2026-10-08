import { test as base } from "@playwright/test";
import { RegisterPage } from "../../ui/pages/registerPage";

type UiFixtures = {
  registerPage: RegisterPage;
};

export const test = base.extend<UiFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from "@playwright/test";
