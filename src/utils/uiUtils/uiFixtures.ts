import { test as base } from "@playwright/test";
import { CartPage } from "@pages/cartPage";
import { CatalogPage } from "@pages/catalogPage";
import { CheckoutPage } from "@pages/checkoutPage";
import { HomePage } from "@pages/homePage";
import { LoginPage } from "@pages/loginPage";
import { NavigationPage } from "@pages/navigationPage";
import { ProductPage } from "@pages/productPage";
import { RegisterPage } from "@pages/registerPage";

type UiFixtures = {
  cartPage: CartPage;
  catalogPage: CatalogPage;
  checkoutPage: CheckoutPage;
  homePage: HomePage;
  loginPage: LoginPage;
  navigationPage: NavigationPage;
  productPage: ProductPage;
  registerPage: RegisterPage;
};

export const test = base.extend<UiFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from "@playwright/test";
