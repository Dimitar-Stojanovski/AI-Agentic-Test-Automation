import { test, expect } from "@utils/uiUtils/uiFixtures";
import { LOGIN_ERROR_MESSAGE, UNKNOWN_USER } from "@utils/testData/users";

test.describe("Login", () => {
  test("shows an error message for non existing credentials", async ({
    loginPage,
  }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(UNKNOWN_USER.email, UNKNOWN_USER.password);

    await expect(loginPage.errorMessage).toContainText(LOGIN_ERROR_MESSAGE);
  });
});
