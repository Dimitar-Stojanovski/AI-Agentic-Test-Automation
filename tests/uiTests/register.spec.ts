import { test, expect } from "@utils/uiUtils/uiFixtures";
import { boxOf } from "@utils/uiUtils/locatorUtils";
import {
  EMAIL_WITHOUT_AT,
  OTHER_INVALID_EMAILS,
  VALID_USER,
  missingAtMessage,
} from "@utils/testData/users";

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
    const first = await boxOf(registerPage.firstNameInput);
    const last = await boxOf(registerPage.lastNameInput);
    const email = await boxOf(registerPage.emailInput);
    const password = await boxOf(registerPage.passwordInput);
    expect(first.y).toBeLessThan(last.y);
    expect(last.y).toBeLessThan(email.y);
    expect(email.y).toBeLessThan(password.y);
    for (const label of [
      registerPage.firstNameLabel,
      registerPage.lastNameLabel,
      registerPage.emailLabel,
      registerPage.passwordLabel,
    ]) {
      await expect(label).toBeVisible();
    }
    await expect(registerPage.createButton).toBeVisible();
    const button = await boxOf(registerPage.createButton);
    expect(button.y).toBeGreaterThan(password.y);
  });

  test('TC-REG-02: Header "Sign up" link opens the register page', async ({
    homePage,
    navigationPage,
    registerPage,
  }) => {
    await homePage.navigateToHomePage();
    await navigationPage.openSignUp();

    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.firstNameInput).toBeVisible();
  });

  test('TC-REG-03: Breadcrumb "Home" link returns to the home page', async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.clickBreadcrumbHome();

    await expect(registerPage.page).toHaveURL("/");
    await expect(registerPage.frontpageProductLinks.first()).toBeVisible();
  });

  test("TC-REG-10: Email without @ is rejected by the browser", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({
      ...VALID_USER,
      email: EMAIL_WITHOUT_AT,
    });
    await registerPage.submit();

    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
    await expect
      .poll(() => registerPage.emailValidationMessage())
      .toBe(missingAtMessage(EMAIL_WITHOUT_AT));
  });

  test("TC-REG-11: Other invalid email formats", async ({ registerPage }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({
      firstName: VALID_USER.firstName,
      lastName: VALID_USER.lastName,
      password: VALID_USER.password,
    });

    for (const email of OTHER_INVALID_EMAILS) {
      await test.step(`Email "${email}" is rejected`, async () => {
        await registerPage.fillRegistrationForm({ email });
        await registerPage.submit();

        await expect(registerPage.page).toHaveURL(/\/account\/register$/);
        await expect
          .poll(() => registerPage.emailValidationMessage())
          .not.toBe("");
      });
    }
  });

  test("TC-REG-16: Password is masked while typing", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();
    await registerPage.fillRegistrationForm({ password: VALID_USER.password });

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
    await registerPage.focusFirstName();
    await registerPage.pressTab();
    await expect(registerPage.lastNameInput).toBeFocused();
    await registerPage.pressTab();
    await expect(registerPage.emailInput).toBeFocused();
    await registerPage.pressTab();
    await expect(registerPage.passwordInput).toBeFocused();
    await registerPage.pressTab();
    await expect(registerPage.createButton).toBeFocused();

    // Step 3
    await registerPage.fillRegistrationForm({ email: EMAIL_WITHOUT_AT });
    // Step 4
    await registerPage.submitWithEnter();

    await expect
      .poll(() => registerPage.emailValidationMessage())
      .toBe(missingAtMessage(EMAIL_WITHOUT_AT));
    await expect(registerPage.page).toHaveURL(/\/account\/register$/);
  });

  test("TC-REG-23: Clicking a field label focuses its field", async ({
    registerPage,
  }) => {
    await registerPage.navigateToRegisterPage();

    const labelledFields = [
      {
        name: "First Name",
        label: registerPage.firstNameLabel,
        input: registerPage.firstNameInput,
      },
      {
        name: "Last Name",
        label: registerPage.lastNameLabel,
        input: registerPage.lastNameInput,
      },
      {
        name: "Email Address",
        label: registerPage.emailLabel,
        input: registerPage.emailInput,
      },
      {
        name: "Password",
        label: registerPage.passwordLabel,
        input: registerPage.passwordInput,
      },
    ];
    for (const { name, label, input } of labelledFields) {
      await test.step(`Clicking the "${name}" label focuses its field`, async () => {
        await registerPage.clickLabel(label);
        await expect(input).toBeFocused();
      });
    }
  });
});
