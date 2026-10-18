# Register test cases

## Notes

**Scope:** Customer account creation at `/account/register` ("Create Account" page), including entry points, field validation, duplicate accounts, and the register-then-login flow. Checkout and the Sauce social plugin are out of scope.

**Live-page observations (2026-10-18):**

- Page title is "Create Account – Sauce Demo". The breadcrumb reads "Home — Register" and the heading is "Create Account".
- The form has four fields in this order: First Name (text), Last Name (text), Email Address (email type), Password (masked). Below them is a "Create" button. The page has no "Already have an account? Log in" link and no "Forgot password" link. The header has "Log In" and "Sign up" links.
- No field is marked as required on the page, and no field has a visible length limit.
- If the email has no "@" (e.g. `invalid-email`), the browser blocks it with its own message: "Please include an '@' in the email address. 'invalid-email' is missing an '@'." The browser accepts `a@b`.
- Clicking "Create" starts an invisible hCaptcha check. In the inspection browser, an empty submission sent nothing to the server and showed no message on the page. The hCaptcha badge appeared at the bottom right.

**Blocker:** Because of the hCaptcha, I could not observe server-side validation messages (empty fields, duplicate email, password rules) or the result of a successful registration. Expected results for those cases say "observed behaviour to be confirmed". They need to be run manually by a person who completes the CAPTCHA. Never bypass it.

**Assumptions:** Every test that creates an account uses one dedicated test account (for example a single owned mailbox with plus-addressing). No bulk creation.

**Open questions:**

1. Which fields are mandatory? Are First Name and Last Name optional?
2. What is the password policy (minimum/maximum length, allowed characters)?
3. What error text appears for an empty, invalid or already-registered email, and where is it shown?
4. Where does a successful registration land (account page, home page, or email verification first)? What does the header show afterwards?
5. Are emails matched case-insensitively when checking for duplicates, and is surrounding whitespace trimmed?
6. What happens when a logged-in customer opens `/account/register`?
7. Is the hCaptcha always shown to real shoppers, or only when the risk score is high?

## Test cases

### TC-REG-01: Register page displays the account creation form

**Description:** Verifies the register page loads with all expected fields, labels and the submit button. This is the baseline for all other register tests.
**Priority:** P1

**Steps:**

1. Open `https://sauce-demo.myshopify.com/account/register` in a new browser session.

**Expected results:**

- The browser tab title is "Create Account – Sauce Demo".
- The page heading reads "Create Account".
- The breadcrumb reads "Home — Register".
- Fields labelled "First Name", "Last Name", "Email Address" and "Password" are shown in that order, and all are empty.
- A "Create" button is shown below the fields.

### TC-REG-02: Header "Sign up" link opens the register page

**Description:** Verifies shoppers can reach registration from the global header.
**Priority:** P2

**Steps:**

1. Open the home page `https://sauce-demo.myshopify.com/`.
2. Click "Sign up" in the header.

**Expected results:**

- The URL is `/account/register`.
- The "Create Account" heading and the registration form are displayed.

### TC-REG-03: Breadcrumb "Home" link returns to the home page

**Description:** Verifies breadcrumb navigation away from the register page.
**Priority:** P3

**Steps:**

1. Open `/account/register`.
2. Click "Home" in the breadcrumb.

**Expected results:**

- The home page (`/`) is displayed with the frontpage collection.

### TC-REG-04: Successful registration with valid data

**Description:** Verifies that a new shopper can create an account with valid details. This is the core positive flow.
**Priority:** P1
**Preconditions:** Use the single dedicated test account. The email address has never been registered on the store. A tester completes the hCaptcha if one is presented.

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name (e.g. "Test") in First Name.
3. Enter a valid last name (e.g. "Shopper") in Last Name.
4. Enter the dedicated, unregistered test email in Email Address.
5. Enter a valid password in Password.
6. Click "Create".
7. Complete the hCaptcha challenge if one appears.

**Expected results:**

- No validation error is shown.
- The shopper is taken to the post-registration page and is shown as logged in (for example the header shows an account or "Log Out" link instead of "Log In"). Exact landing page and header text: observed behaviour to be confirmed (open question 4).

### TC-REG-05: End-to-end register, log out and log back in

**Description:** Verifies the newly created credentials work for a later login, which is how shoppers actually use the account.
**Priority:** P1
**Preconditions:** Use the single dedicated test account. The account was just created as in TC-REG-04, or is created in steps 1 to 6.

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Enter the dedicated test email.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.
7. Log out using the logout link shown for logged-in shoppers.
8. Click "Log In" in the header.
9. Enter the same email and password.
10. Submit the login form.

**Expected results:**

- After step 6 the shopper is logged in.
- After step 7 the header shows "Log In" and "Sign up" again.
- After step 10 the shopper is logged in and sees their account page with the first and last name entered at registration.

### TC-REG-06: Submitting an empty form

**Description:** Verifies the form does not create an account and gives feedback when every field is empty.
**Priority:** P1

**Steps:**

1. Open `/account/register`.
2. Leave all four fields empty.
3. Click "Create".
4. Complete the hCaptcha if one appears.

**Expected results:**

- No account is created and the shopper stays on the Create Account page.
- An error message tells the shopper which fields need input. Exact text and placement: observed behaviour to be confirmed. In live inspection no message appeared, because the hCaptcha stopped the submission.

### TC-REG-07: Email address missing

**Description:** Verifies email is required when the other fields are valid.
**Priority:** P1

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Leave Email Address empty.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- No account is created and the Create Account page stays displayed.
- An error about the email appears. Exact text: observed behaviour to be confirmed.

### TC-REG-08: Password missing

**Description:** Verifies password is required when the other fields are valid.
**Priority:** P1

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Enter a valid email address that is not registered.
5. Leave Password empty.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- No account is created and the Create Account page stays displayed.
- An error about the password appears. Exact text: observed behaviour to be confirmed.

### TC-REG-09: First and last name left empty

**Description:** Checks whether the name fields are optional. The page does not mark them as required (open question 1).
**Priority:** P2
**Preconditions:** Use the single dedicated test account, because this test may create an account.

**Steps:**

1. Open `/account/register`.
2. Leave First Name empty.
3. Leave Last Name empty.
4. Enter the dedicated, unregistered test email.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- Either the account is created without names, or an error asks for the names. Which one happens: observed behaviour to be confirmed against the business rule.

### TC-REG-10: Email without "@" is rejected by the browser

**Description:** Verifies the email format check that runs before submission (equivalence class: missing "@").
**Priority:** P1

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Enter `invalid-email` in Email Address.
5. Enter a valid password.
6. Click "Create".

**Expected results:**

- The form is not submitted and the URL stays `/account/register`.
- A browser message appears at the Email Address field: "Please include an '@' in the email address. 'invalid-email' is missing an '@'." (wording may vary by browser).

### TC-REG-11: Other invalid email formats

**Description:** Covers further invalid email classes: nothing before the "@", nothing after it, and spaces inside.
**Priority:** P2

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name, last name and password.
3. Enter `@example.com` in Email Address.
4. Click "Create".
5. Replace the email with `user@`.
6. Click "Create".
7. Replace the email with `us er@example.com`.
8. Click "Create".

**Expected results:**

- For each value the form is not submitted and a browser message explains the format problem in the Email Address field.
- No account is created.

### TC-REG-12: Email without a top-level domain

**Description:** The browser accepts `user@domain` without a TLD. This checks whether the server also accepts it (boundary of email format).
**Priority:** P2

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Enter `testuser@localdomain` in Email Address.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- The browser does not block the submission.
- The server's response (rejection with an email error, or acceptance): observed behaviour to be confirmed.

### TC-REG-13: Registering with an already registered email

**Description:** Verifies the store stops a second account from being created with an existing email.
**Priority:** P1
**Preconditions:** The dedicated test account from TC-REG-04 already exists. Do not create any other account.

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name.
3. Enter a valid last name.
4. Enter the dedicated test email that is already registered.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- No new account is created and the shopper is not logged in.
- A message says the email is already in use, or points the shopper to log in or reset the password. Exact text: observed behaviour to be confirmed.

### TC-REG-14: Duplicate email with different letter case

**Description:** Verifies duplicate detection ignores letter case in the email (error guessing, open question 5).
**Priority:** P2
**Preconditions:** The dedicated test account already exists.

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name and last name.
3. Enter the registered test email in upper case (e.g. `TESTSHOPPER@EXAMPLE.COM`).
4. Enter a valid password.
5. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- The email is treated as a duplicate and no second account is created. Observed behaviour to be confirmed.

### TC-REG-15: Email with leading and trailing spaces

**Description:** Checks how the form handles spaces around an otherwise valid email.
**Priority:** P3
**Preconditions:** The dedicated test account already exists.

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name and last name.
3. Enter the registered test email with two spaces before and after it.
4. Enter a valid password.
5. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- The spaces are trimmed and the email is reported as already registered, or the form rejects the value. Either way no second account is created. Observed behaviour to be confirmed.

### TC-REG-16: Password is masked while typing

**Description:** Verifies the password is not shown in plain text.
**Priority:** P2

**Steps:**

1. Open `/account/register`.
2. Type `Secret123` in Password.

**Expected results:**

- The Password field shows mask characters (dots or asterisks), not `Secret123`.

### TC-REG-17: Password length boundaries

**Description:** Uses boundary value analysis to find the password length rule. The rule is not published (open question 2).
**Priority:** P2

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name, last name and an unregistered email.
3. Enter a 1-character password.
4. Click "Create" and complete the hCaptcha if presented.
5. Note the result.
6. Repeat steps 1 to 5 with passwords of 4, 5 and 6 characters, until the shortest accepted length is found.

**Expected results:**

- Passwords below the minimum are rejected with an error that names the length rule, and no account is created.
- The shortest accepted length matches the confirmed business rule. Observed behaviour to be confirmed.
- Stop at the first accepted value so that at most one account (the dedicated test account) is created.

### TC-REG-18: Entered values are kept after a failed submission

**Description:** Verifies shoppers do not have to type everything again after a validation error.
**Priority:** P2
**Preconditions:** The dedicated test account already exists, so its email triggers a duplicate error.

**Steps:**

1. Open `/account/register`.
2. Enter "Test" in First Name.
3. Enter "Shopper" in Last Name.
4. Enter the already registered test email.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- An error is shown.
- First Name, Last Name and Email Address still contain the entered values. Password may be cleared. Observed behaviour to be confirmed.

### TC-REG-19: Script-like text in name fields is shown as plain text

**Description:** Error guessing for injection: markup entered as a name must not run or change the page.
**Priority:** P2
**Preconditions:** Use the single dedicated test account.

**Steps:**

1. Open `/account/register`.
2. Enter `<script>alert(1)</script>` in First Name.
3. Enter `<b>Bold</b>` in Last Name.
4. Enter the dedicated, unregistered test email.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.
7. Open the account page.

**Expected results:**

- No alert dialog appears at any point.
- If the name is displayed, it appears as literal text and is not shown in bold.

### TC-REG-20: Names with accents, apostrophes and hyphens

**Description:** Verifies real-world names are accepted (equivalence class: valid non-ASCII and punctuation).
**Priority:** P3
**Preconditions:** Use the single dedicated test account.

**Steps:**

1. Open `/account/register`.
2. Enter `Zoë-Anne` in First Name.
3. Enter `O'Brien` in Last Name.
4. Enter the dedicated, unregistered test email.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.
7. Open the account page.

**Expected results:**

- The account is created without errors.
- The name shows exactly as "Zoë-Anne O'Brien".

### TC-REG-21: Very long input values

**Description:** Boundary check for field lengths. The page shows no maximum length.
**Priority:** P3

**Steps:**

1. Open `/account/register`.
2. Enter 256 characters in First Name.
3. Enter 256 characters in Last Name.
4. Enter an email address of more than 254 characters, with a valid format.
5. Enter a valid password.
6. Click "Create" and complete the hCaptcha if presented.

**Expected results:**

- The page does not crash or show a server error.
- Too-long values are rejected with a clear message, or are truncated. Observed behaviour to be confirmed.

### TC-REG-22: Submitting the form with the Enter key

**Description:** Verifies keyboard-only shoppers can submit the form.
**Priority:** P3

**Steps:**

1. Open `/account/register`.
2. Press Tab to move through the fields and check that focus goes First Name, Last Name, Email Address, Password, Create.
3. Type `invalid-email` in Email Address.
4. Press Enter while the cursor is in the Password field.

**Expected results:**

- Focus moves through the fields in the visual order.
- Pressing Enter submits the form in the same way as clicking "Create": the browser email message from TC-REG-10 appears.

### TC-REG-23: Clicking a field label focuses its field

**Description:** Verifies each label is linked to its field, which screen-reader users and click-on-label users depend on.
**Priority:** P3

**Steps:**

1. Open `/account/register`.
2. Click the "First Name" label text.
3. Click the "Last Name" label text.
4. Click the "Email Address" label text.
5. Click the "Password" label text.

**Expected results:**

- After each click, the cursor is in the matching field.
- A screen reader announces each field with its label name.

### TC-REG-24: CAPTCHA protects account creation

**Description:** Verifies the bot protection runs when the form is submitted and the form cannot be completed without it.
**Priority:** P2

**Steps:**

1. Open `/account/register`.
2. Enter a valid first name, last name and an unregistered email.
3. Enter a valid password.
4. Click "Create".
5. When an hCaptcha challenge appears, close it without solving it.

**Expected results:**

- An hCaptcha check runs: either the badge or a challenge is shown.
- If the challenge is not solved, the form is not submitted and no account is created.

### TC-REG-25: Logged-in shopper opens the register page

**Description:** Checks the state where an already authenticated customer opens the registration URL.
**Priority:** P3
**Preconditions:** The dedicated test account exists and the shopper is logged in with it.

**Steps:**

1. Open `/account/register` directly in the address bar.

**Expected results:**

- The shopper is redirected to their account page, or sees the form without losing their session. Observed behaviour to be confirmed (open question 6).
