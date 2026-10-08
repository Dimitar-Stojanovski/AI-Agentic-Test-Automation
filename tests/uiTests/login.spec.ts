import { test, expect } from "@utils/uiUtils/uiFixtures";

test.describe("Login", () => {
  test("shows an error message for non existing credentials", async ({
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.login("nonexistent.user@example.com", "WrongPass123");

    await expect(loginPage.errorMessage).toContainText(
      "Incorrect email or password.",
    );
  });
});
