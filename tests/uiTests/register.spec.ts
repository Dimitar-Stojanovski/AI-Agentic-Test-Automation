import { test, expect } from "@utils/uiUtils/uiFixtures";

test.describe("Register", () => {
  test("TC-REG-01: Register page displays the account creation form", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();

    await expect(registerPage.page).toHaveTitle("Create Account – Sauce Demo");
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.breadcrumb).toHaveText("Home — Register");
    for (const input of [
      registerPage.firstNameInput,
      registerPage.lastNameInput,
      registerPage.emailInput,
      registerPage.passwordInput,
    ]) {
      await expect(input).toBeVisible();
      await expect(input).toBeEmpty();
    }
    const [first, last, email, password] = await Promise.all(
      [
        registerPage.firstNameInput,
        registerPage.lastNameInput,
        registerPage.emailInput,
        registerPage.passwordInput,
      ].map((input) => input.boundingBox()),
    );
    expect(first!.y).toBeLessThan(last!.y);
    expect(last!.y).toBeLessThan(email!.y);
    expect(email!.y).toBeLessThan(password!.y);
    for (const label of [
      registerPage.firstNameLabel,
      registerPage.lastNameLabel,
      registerPage.emailLabel,
      registerPage.passwordLabel,
    ]) {
      await expect(label).toBeVisible();
    }
    await expect(registerPage.createButton).toBeVisible();
    const button = await registerPage.createButton.boundingBox();
    expect(button!.y).toBeGreaterThan(password!.y);
  });

  test('TC-REG-02: Header "Sign up" link opens the register page', async ({
    registerPage,
  }) => {
    await registerPage.navigateToHomePage();
    await registerPage.clickHeaderSignUp();

    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.firstNameInput).toBeVisible();
  });

  test('TC-REG-03: Breadcrumb "Home" link returns to the home page', async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.clickBreadcrumbHome();

    await expect(registerPage.page).toHaveURL(/sauce-demo\.myshopify\.com\/$/);
    await expect(registerPage.frontpageProductLinks.first()).toBeVisible();
  });

  test("TC-REG-10: Email without @ is rejected by the browser", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({
      firstName: "Test",
      lastName: "Shopper",
      email: "invalid-email",
      password: "Secret123",
    });
    await registerPage.submit();

    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
    await expect
      .poll(() =>
        registerPage.emailInput.evaluate(
          (input: HTMLInputElement) => input.validationMessage,
        ),
      )
      .toBe(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'.",
      );
  });

  test("TC-REG-11: Other invalid email formats", async ({ registerPage }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({
      firstName: "Test",
      lastName: "Shopper",
      password: "Secret123",
    });

    for (const email of ["@example.com", "user@", "us er@example.com"]) {
      await registerPage.fillRegistrationForm({ email });
      await registerPage.submit();

      await expect(registerPage.page).toHaveURL(/\/account\/register$/);
      await expect
        .poll(() =>
          registerPage.emailInput.evaluate(
            (input: HTMLInputElement) => input.validationMessage,
          ),
        )
        .not.toBe("");
    }
  });

  test("TC-REG-16: Password is masked while typing", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({ password: "Secret123" });

    await expect(registerPage.passwordInput).toHaveAttribute(
      "type",
      "password",
    );
  });

  test("TC-REG-22: Submitting the form with the Enter key", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();

    // Step 2
    await registerPage.firstNameInput.focus();
    await registerPage.page.keyboard.press("Tab");
    await expect(registerPage.lastNameInput).toBeFocused();
    await registerPage.page.keyboard.press("Tab");
    await expect(registerPage.emailInput).toBeFocused();
    await registerPage.page.keyboard.press("Tab");
    await expect(registerPage.passwordInput).toBeFocused();
    await registerPage.page.keyboard.press("Tab");
    await expect(registerPage.createButton).toBeFocused();

    // Step 3
    await registerPage.fillRegistrationForm({ email: "invalid-email" });
    // Step 4
    await registerPage.passwordInput.press("Enter");

    await expect
      .poll(() =>
        registerPage.emailInput.evaluate(
          (input: HTMLInputElement) => input.validationMessage,
        ),
      )
      .toBe(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'.",
      );
    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
  });

  test("TC-REG-23: Clicking a field label focuses its field", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();

    await registerPage.firstNameLabel.click();
    await expect(registerPage.firstNameInput).toBeFocused();
    await registerPage.lastNameLabel.click();
    await expect(registerPage.lastNameInput).toBeFocused();
    await registerPage.emailLabel.click();
    await expect(registerPage.emailInput).toBeFocused();
    await registerPage.passwordLabel.click();
    await expect(registerPage.passwordInput).toBeFocused();
  });
});
