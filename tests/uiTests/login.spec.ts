import { test, expect } from "@utils/uiUtils/uiFixtures";
import { cartCountLabel } from "@utils/formatters";
import { HEELS } from "@utils/testData/products";
import {
  EMAIL_WITHOUT_AT,
  LOGIN_ERROR_MESSAGE,
  OTHER_INVALID_EMAILS,
  LONG_PASSWORD,
  MASKED_PASSWORD,
  SCRIPT_PASSWORD,
  SHORT_VALID_EMAIL,
  SOME_PASSWORD,
  UNKNOWN_USER,
  VALID_USER,
  missingAtMessage,
  testAccount,
} from "@utils/testData/users";

const CAPTCHA_BLOCKED = "blocked by hCaptcha";
const LOGIN_URL = /\/account\/login$/;
const REGISTER_URL = /\/account\/register$/;
const LOGIN_PAGE_TITLE = "Account – Sauce Demo";
const LOGIN_BREADCRUMB = "Home — Login";

test.describe("Login", () => {
  test("shows an error message for non existing credentials", async ({
    loginPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.login(UNKNOWN_USER.email, UNKNOWN_USER.password);

    await expect(loginPage.errorMessage).toContainText(LOGIN_ERROR_MESSAGE);
  });

  test("TC-LOGIN-01: Login page displays the login form", async ({
    page,
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();

    await expect(page).toHaveTitle(LOGIN_PAGE_TITLE);
    await expect(loginPage.heading).toHaveText("Customer Login");
    await expect(loginPage.breadcrumb).toHaveText(LOGIN_BREADCRUMB);
    await expect(loginPage.emailInput).toHaveValue("");
    await expect(loginPage.passwordInput).toHaveValue("");
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.createAccountLink).toBeVisible();
    await expect(loginPage.resetHeading).toBeHidden();
  });

  test('TC-LOGIN-02: Header "Log In" link opens the login page', async ({
    page,
    homePage,
    navigationPage,
    loginPage,
  }) => {
    await homePage.navigateToHomePage();
    await navigationPage.openLogIn();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test("TC-LOGIN-03: Password field masks input", async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.fillPassword(MASKED_PASSWORD);

    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("TC-LOGIN-04: Valid login with a registered test account", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    const { email, password } = testAccount();
    await loginPage.login(email, password);

    // The landing page and the logged-in header are still to be confirmed
    await expect(page).not.toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeHidden();
    await expect(navigationPage.headerSignUpLink).toBeHidden();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test("TC-LOGIN-05: Wrong password for a registered account", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.login(testAccount().email, UNKNOWN_USER.password);

    // The error message text and position are still to be confirmed
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeVisible();
    await expect(navigationPage.headerSignUpLink).toBeVisible();
  });

  test("TC-LOGIN-06: Unknown email", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.login(UNKNOWN_USER.email, SOME_PASSWORD);

    // The error message text is still to be confirmed
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeVisible();
  });

  test("TC-LOGIN-07: Empty email and password", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.submit();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeVisible();
  });

  test("TC-LOGIN-08: Email filled, password empty", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.fillEmail(UNKNOWN_USER.email);
    await loginPage.submit();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeVisible();
  });

  test("TC-LOGIN-09: Password filled, email empty", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.fillPassword(SOME_PASSWORD);
    await loginPage.submit();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeVisible();
  });

  test('TC-LOGIN-10: Email without "@" is blocked by the browser', async ({
    page,
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(EMAIL_WITHOUT_AT, SOME_PASSWORD);

    expect(await loginPage.emailValidationMessage()).toBe(
      missingAtMessage(EMAIL_WITHOUT_AT),
    );
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("TC-LOGIN-11: Email format boundary cases", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    // Steps 2-7: each input is tried on a freshly loaded page
    for (const email of OTHER_INVALID_EMAILS) {
      await loginPage.navigateToLoginPage();
      await loginPage.login(email, SOME_PASSWORD);

      // Whether the browser or the server rejects it is still to be confirmed
      await expect(page).toHaveURL(LOGIN_URL);
      await expect(navigationPage.headerLogInLink).toBeVisible();
    }
  });

  test("TC-LOGIN-12: Email case and surrounding spaces", async ({
    loginPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    const { email, password } = testAccount();

    // Steps 1-3: upper case email
    await loginPage.navigateToLoginPage();
    await loginPage.login(email.toUpperCase(), password);

    // Step 4: leading space (log out first if the previous login succeeded)
    await loginPage.navigateToLoginPage();
    await loginPage.login(` ${email}`, password);

    // Whether each variant logs in is still to be confirmed (open question 4),
    // so there is nothing to assert yet.
  });

  test("TC-LOGIN-13: Login attempts with script and long input", async ({
    page,
    loginPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    let dialogShown = false;
    page.on("dialog", async (dialog) => {
      dialogShown = true;
      await dialog.dismiss();
    });

    await loginPage.navigateToLoginPage();
    await loginPage.login(SHORT_VALID_EMAIL, SCRIPT_PASSWORD);
    await loginPage.navigateToLoginPage();
    await loginPage.login(SHORT_VALID_EMAIL, LONG_PASSWORD);

    expect(dialogShown).toBe(false);
    await expect(navigationPage.headerLogInLink).toBeVisible();
  });

  test('TC-LOGIN-14: "Forgot your password?" shows the inline Reset Password form', async ({
    page,
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();
    // Marker used to prove that the click does not reload the page
    await page.evaluate(() => Object.assign(window, { noReloadMarker: true }));
    await loginPage.clickForgotPassword();

    await expect(loginPage.resetHeading).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.resetEmailInput).toBeVisible();
    await expect(loginPage.resetInstructions).toBeVisible();
    await expect(loginPage.resetSubmitButton).toBeVisible();
    await expect(loginPage.resetCancelLink).toBeVisible();
    expect(await page.evaluate(() => "noReloadMarker" in window)).toBe(true);
  });

  test("TC-LOGIN-15: Cancel hides the Reset Password form", async ({
    page,
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.clickForgotPassword();
    await loginPage.cancelReset();

    await expect(loginPage.resetHeading).toBeHidden();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("TC-LOGIN-16: Reset password for the registered test account", async ({
    loginPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.clickForgotPassword();
    await loginPage.fillResetEmail(testAccount().email);
    await loginPage.submitReset();

    // The confirmation text is still to be confirmed, and the reset email in
    // the mailbox cannot be checked from the browser.
  });

  test("TC-LOGIN-17: Reset password with invalid or unknown email", async ({
    page,
    loginPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    await loginPage.clickForgotPassword();

    // Step 2
    await loginPage.fillResetEmail(EMAIL_WITHOUT_AT);
    await loginPage.submitReset();
    await expect(page).toHaveURL(LOGIN_URL);

    // Step 3: the result is still to be confirmed
    await loginPage.fillResetEmail(UNKNOWN_USER.email);
    await loginPage.submitReset();

    // Step 4: the result is still to be confirmed
    await loginPage.fillResetEmail("");
    await loginPage.submitReset();
  });

  test('TC-LOGIN-18: "Create account" link opens the register page', async ({
    page,
    loginPage,
    registerPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.clickCreateAccount();

    await expect(page).toHaveURL(REGISTER_URL);
    await expect(registerPage.heading).toBeVisible();
  });

  test('TC-LOGIN-19: Header "Sign up" link from the login page', async ({
    page,
    loginPage,
    navigationPage,
    registerPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await navigationPage.openSignUp();

    await expect(page).toHaveURL(REGISTER_URL);
    await expect(registerPage.heading).toBeVisible();
  });

  test("TC-LOGIN-20: Register then log in end to end", async ({
    page,
    loginPage,
    registerPage,
    navigationPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    const { email, password } = testAccount();

    // Steps 1-2
    await loginPage.navigateToLoginPage();
    await loginPage.clickCreateAccount();
    await registerPage.fillRegistrationForm({
      firstName: VALID_USER.firstName,
      lastName: VALID_USER.lastName,
      email,
      password,
    });
    await registerPage.submit();
    // The landing page after registration is still to be confirmed

    // Steps 3-5 (log out first if registration logged the shopper in)
    await loginPage.navigateToLoginPage();
    await loginPage.login(email, password);

    await expect(page).not.toHaveURL(LOGIN_URL);
    await expect(navigationPage.headerLogInLink).toBeHidden();
  });

  test("TC-LOGIN-21: Login page keeps the cart contents", async ({
    catalogPage,
    productPage,
    navigationPage,
    loginPage,
    cartPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    // Steps 1-2
    await catalogPage.navigateToCatalog();
    await catalogPage.openProduct(HEELS.name);
    const title = await productPage.title.innerText();
    await productPage.addToCart();

    // Steps 3-4
    await navigationPage.openLogIn();
    const { email, password } = testAccount();
    await loginPage.login(email, password);

    // Step 5
    await cartPage.navigateToCart();
    const row = cartPage.rowFor(title);
    await expect(row).toHaveCount(1);
    await expect(cartPage.quantityOf(row)).toHaveValue("1");
    await expect(navigationPage.cartLink).toHaveText(cartCountLabel(1));
  });

  test("TC-LOGIN-22: Repeated failed logins (throttling)", async ({
    page,
    loginPage,
  }) => {
    test.skip(true, CAPTCHA_BLOCKED);

    await loginPage.navigateToLoginPage();
    for (let attempt = 0; attempt < 5; attempt++) {
      await loginPage.login(UNKNOWN_USER.email, UNKNOWN_USER.password);

      // Any throttling or lockout message is still to be confirmed (open question 5)
      await expect(page).toHaveURL(LOGIN_URL);
    }
  });
});
