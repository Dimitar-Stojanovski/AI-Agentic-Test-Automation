# Login test cases

## Notes

**Scope:** Customer login at `/account/login` ("Customer Login" page): page content, entry points, field behaviour, invalid and empty submissions, the inline Reset Password form, navigation links, and the register-then-login flow. Checkout and the Sauce social plugin are out of scope.

**Live-page observations (2026-11-09):**

- Page title is "Account – Sauce Demo". The breadcrumb reads "Home — Login" and the heading is "Customer Login".
- The login form has "Email Address" (email type), "Password" (masked), a submit button (Login) and a "Forgot your password?" link. A "Create account" link to `/account/register` is also on the page. The header has "Log In" (`/account/login`) and "Sign up" (`/account/register`).
- No field is marked required, so an empty form can be submitted.
- Clicking "Forgot your password?" shows an inline "Reset Password" section on the same page, with an Email field, the text "We will send you an email to reset your password.", a "Submit" button and "or Cancel". The URL does not change. "Cancel" hides it again.
- An email without "@" (for example `notanemail`) is blocked by the browser with its own message: "Please include an '@' in the email address. 'notanemail' is missing an '@'." Nothing is sent to the server.
- Submitting empty, unknown-account or wrong-password data triggered an invisible hCaptcha ("Protected by hCaptcha", a challenge frame loads). In the inspection session the page stayed on `/account/login` and **no error message was displayed** within 4 seconds. The same happened for the Reset Password submit (no confirmation shown).
- No credentials for an existing shopper account are published. No throttling message was seen.

**Blocker:** hCaptcha prevents observing server-side results (the real invalid-credentials error text, successful login landing page, reset confirmation). Those expected results say "observed behaviour to be confirmed" and must be run by a person who completes the CAPTCHA. Never bypass it.

**Assumptions:** Each test starts in a new browser session, logged out. Tests needing a valid login use one dedicated test account (for example one owned mailbox with plus-addressing), created once through registration. No bulk account creation. Unknown-account tests use an address that is not registered, for example one at `example.com`.

**Open questions:**

1. What error text appears for wrong password, unknown email and empty fields, and where is it shown?
2. Is the same message used for unknown email and wrong password (to avoid account enumeration)?
3. Where does a successful login land (account page, home page)? What does the header show afterwards (for example "Log Out" or account name replacing "Log In" and "Sign up")?
4. Is the email matched case-insensitively, and is surrounding whitespace trimmed?
5. Is there a lockout or throttling after repeated failures?
6. What confirmation does the Reset Password form show, and does it differ for unknown emails?
7. What happens when a logged-in customer opens `/account/login`?
8. Is the hCaptcha always shown, or only for risky sessions?

**Suspected defects / observations to confirm:**

- Failed login showed no visible message in the inspection session (may be caused by the unsolved hCaptcha).
- Reset Password submit showed no visible confirmation in the same session.
- The login page has no Show Password option and the fields have no required markers.

## Test cases

### TC-LOGIN-01: Login page displays the login form

**Description:** Verifies the login page loads with all expected elements. This is the baseline for all other login tests.
**Priority:** P1

**Steps:**

1. Open `https://sauce-demo.myshopify.com/account/login` in a new browser session.

**Expected results:**

- The browser tab title is "Account – Sauce Demo".
- The heading reads "Customer Login" and the breadcrumb reads "Home — Login".
- Fields labelled "Email Address" and "Password" are shown, both empty.
- A login submit button and a "Forgot your password?" link are shown.
- A "Create account" link is shown.
- The Reset Password section is not visible.

### TC-LOGIN-02: Header "Log In" link opens the login page

**Description:** Verifies shoppers can reach login from the global header.
**Priority:** P2

**Steps:**

1. Open the home page `https://sauce-demo.myshopify.com/`.
2. Click "Log In" in the header.

**Expected results:**

- The URL is `/account/login`.
- The "Customer Login" heading and form are shown.

### TC-LOGIN-03: Password field masks input

**Description:** Verifies the typed password is not displayed in clear text.
**Priority:** P2

**Steps:**

1. Open `/account/login`.
2. Type `Secret123!` in "Password".

**Expected results:**

- The characters are shown as masked dots or asterisks, not as readable text.

### TC-LOGIN-04: Valid login with a registered test account

**Description:** Verifies a registered shopper can log in with correct credentials.
**Priority:** P1
**Preconditions:** A dedicated test account exists (created once, never in bulk). The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter the test account's email in "Email Address".
3. Enter the test account's password in "Password".
4. Click the login button.

**Expected results:**

- The shopper is no longer on the login form. The landing page is observed behaviour to be confirmed.
- The header no longer offers the logged-out state ("Log In" and "Sign up"); the exact logged-in header is observed behaviour to be confirmed.
- No error message is shown.

### TC-LOGIN-05: Wrong password for a registered account

**Description:** Verifies login is refused when the email is registered but the password is wrong.
**Priority:** P1
**Preconditions:** The dedicated test account exists. The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter the test account's email in "Email Address".
3. Enter `WrongPass!999` in "Password".
4. Click the login button.

**Expected results:**

- The shopper stays on the login page and is not logged in.
- An error message is shown; its exact text and position are observed behaviour to be confirmed.
- The header still shows "Log In" and "Sign up".

### TC-LOGIN-06: Unknown email

**Description:** Verifies login is refused for an email with no account.
**Priority:** P1
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter `no-such-user-qa@example.com` in "Email Address".
3. Enter `SomePass123` in "Password".
4. Click the login button.

**Expected results:**

- The shopper stays on the login page and is not logged in.
- An error message is shown; its text is observed behaviour to be confirmed, including whether it matches TC-LOGIN-05.

### TC-LOGIN-07: Empty email and password

**Description:** Verifies submitting an empty form does not log the shopper in.
**Priority:** P1
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Leave both fields empty.
3. Click the login button.

**Expected results:**

- The shopper stays on the login page and is not logged in.
- Any validation message is observed behaviour to be confirmed (none was visible in the inspection session).

### TC-LOGIN-08: Email filled, password empty

**Description:** Verifies a missing password is rejected.
**Priority:** P2
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter `no-such-user-qa@example.com` in "Email Address".
3. Leave "Password" empty.
4. Click the login button.

**Expected results:**

- The shopper stays on the login page and is not logged in.
- Any message is observed behaviour to be confirmed.

### TC-LOGIN-09: Password filled, email empty

**Description:** Verifies a missing email is rejected.
**Priority:** P2
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Leave "Email Address" empty.
3. Enter `SomePass123` in "Password".
4. Click the login button.

**Expected results:**

- The shopper stays on the login page and is not logged in.
- Any message is observed behaviour to be confirmed.

### TC-LOGIN-10: Email without "@" is blocked by the browser

**Description:** Verifies basic email format validation before submission.
**Priority:** P2

**Steps:**

1. Open `/account/login`.
2. Enter `notanemail` in "Email Address".
3. Enter `SomePass123` in "Password".
4. Click the login button.

**Expected results:**

- A browser message is shown on the email field: "Please include an '@' in the email address. 'notanemail' is missing an '@'."
- The form is not submitted and the shopper stays on `/account/login`.

### TC-LOGIN-11: Email format boundary cases

**Description:** Verifies how emails that are malformed in other ways are handled (equivalence partitioning of the email input).
**Priority:** P3
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter `user@` in "Email Address" and `SomePass123` in "Password".
3. Click the login button and note the result.
4. Reload the page, enter `@example.com` in "Email Address" and `SomePass123` in "Password".
5. Click the login button and note the result.
6. Reload the page, enter `user name@example.com` in "Email Address" and `SomePass123` in "Password".
7. Click the login button and note the result.

**Expected results:**

- For each input the shopper is not logged in.
- Whether the browser or the server rejects each input, and the message text, is observed behaviour to be confirmed.

### TC-LOGIN-12: Email case and surrounding spaces

**Description:** Verifies how the registered email is matched when typed in different case or with spaces.
**Priority:** P3
**Preconditions:** The dedicated test account exists. The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter the test account's email in upper case in "Email Address" and the correct password in "Password".
3. Click the login button and note the result.
4. Log out if logged in, open `/account/login`, enter the correct email with a leading space and the correct password, click the login button and note the result.

**Expected results:**

- Whether each variant logs in is observed behaviour to be confirmed (open question 4). No unexpected error page is shown.

### TC-LOGIN-13: Login attempts with script and long input

**Description:** Verifies unusual input does not break the page or log the shopper in.
**Priority:** P3
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login`.
2. Enter `a@b.co` in "Email Address".
3. Enter `<script>alert(1)</script>` in "Password".
4. Click the login button.
5. Reload the page, enter `a@b.co` and a 300-character password, then click the login button.

**Expected results:**

- No script runs and no alert dialog appears.
- The shopper is not logged in and no server error page is shown.

### TC-LOGIN-14: "Forgot your password?" shows the inline Reset Password form

**Description:** Verifies the reset form toggles on the same page.
**Priority:** P1

**Steps:**

1. Open `/account/login`.
2. Click "Forgot your password?".

**Expected results:**

- A "Reset Password" section appears on the same page and the URL stays `/account/login`.
- It contains an "Email" field, the text "We will send you an email to reset your password.", a "Submit" button and a "Cancel" link.
- The page does not reload.

### TC-LOGIN-15: Cancel hides the Reset Password form

**Description:** Verifies the shopper can return to the login form from the reset form.
**Priority:** P2

**Steps:**

1. Open `/account/login`.
2. Click "Forgot your password?".
3. Click "Cancel".

**Expected results:**

- The Reset Password section is hidden and the login form is shown again.
- The URL stays `/account/login`.

### TC-LOGIN-16: Reset password for the registered test account

**Description:** Verifies a reset request is accepted for a registered email.
**Priority:** P2
**Preconditions:** The dedicated test account exists and its mailbox is accessible. The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login` and click "Forgot your password?".
2. Enter the test account's email in the reset "Email" field.
3. Click "Submit".

**Expected results:**

- A confirmation message is shown; its text and position are observed behaviour to be confirmed.
- A password reset email arrives in the test mailbox.

### TC-LOGIN-17: Reset password with invalid or unknown email

**Description:** Verifies the reset form handles bad input.
**Priority:** P3
**Preconditions:** The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/account/login` and click "Forgot your password?".
2. Enter `notanemail` in the reset "Email" field and click "Submit". Note the result.
3. Clear the field, enter `no-such-user-qa@example.com` and click "Submit". Note the result.
4. Clear the field, leave it empty and click "Submit". Note the result.

**Expected results:**

- Step 2: the browser shows its "Please include an '@'..." message and nothing is submitted.
- Steps 3 and 4: the messages (or confirmation) are observed behaviour to be confirmed; no server error page is shown.

### TC-LOGIN-18: "Create account" link opens the register page

**Description:** Verifies a new shopper can move from login to registration.
**Priority:** P2

**Steps:**

1. Open `/account/login`.
2. Click "Create account".

**Expected results:**

- The URL is `/account/register`.
- The "Create Account" heading and form are shown.

### TC-LOGIN-19: Header "Sign up" link from the login page

**Description:** Verifies the header registration link works while on the login page.
**Priority:** P3

**Steps:**

1. Open `/account/login`.
2. Click "Sign up" in the header.

**Expected results:**

- The URL is `/account/register` and the "Create Account" page is shown.

### TC-LOGIN-20: Register then log in end to end

**Description:** Verifies a newly created account can log in, covering the full new-shopper journey.
**Priority:** P1
**Preconditions:** Uses the one dedicated test account only; do not create further accounts. If the account already exists, use TC-LOGIN-04 instead. The hCaptcha must be completed by a person.

**Steps:**

1. Open `/account/login` and click "Create account".
2. Fill First Name, Last Name, Email Address (the dedicated test mailbox) and a Password, then click "Create".
3. If the shopper ends up logged in, log out; otherwise continue.
4. Open `/account/login`.
5. Enter the same email and password and click the login button.

**Expected results:**

- Registration succeeds; where it lands is observed behaviour to be confirmed.
- Login with the same credentials succeeds and the logged-in state is shown in the header.

### TC-LOGIN-21: Login page keeps the cart contents

**Description:** Verifies logging in does not lose items already in the cart.
**Priority:** P2
**Preconditions:** The dedicated test account exists. The hCaptcha must be completed by a person if shown.

**Steps:**

1. Open `/collections/all` and open any in-stock product.
2. Click "Add to Cart" and note the header "My Cart (n)" count.
3. Click "Log In" in the header.
4. Log in with the test account's credentials.
5. Open `/cart`.

**Expected results:**

- The cart still contains the product added in step 2 with the same quantity.
- The header count matches the quantity.

### TC-LOGIN-22: Repeated failed logins (throttling)

**Description:** Checks whether repeated failures cause a lockout or throttling message.
**Priority:** P3
**Preconditions:** Use the unknown email `no-such-user-qa@example.com`, never the test account, and limit to 5 attempts. The hCaptcha must be completed by a person if shown. Stop if a bot wall appears.

**Steps:**

1. Open `/account/login`.
2. Submit `no-such-user-qa@example.com` with `WrongPass!999` five times in a row.

**Expected results:**

- Each attempt is refused and the shopper is never logged in.
- Any throttling or lockout message is observed behaviour to be confirmed (open question 5).
