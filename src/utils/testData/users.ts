export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const VALID_USER: UserDetails = {
  firstName: "Test",
  lastName: "Shopper",
  email: "test.shopper@example.com",
  password: "Secret123",
};

// An account that does not exist in the store
export const UNKNOWN_USER = {
  email: "nonexistent.user@example.com",
  password: "WrongPass123",
};

export const LOGIN_ERROR_MESSAGE = "Incorrect email or password.";

export const EMAIL_WITHOUT_AT = "invalid-email";
export const OTHER_INVALID_EMAILS = [
  "@example.com",
  "user@",
  "us er@example.com",
];

// A fresh address per call, for flows that need an email the store has not seen
export const uniqueEmail = () => `shopper+${Date.now()}@example.com`;

// The text Chromium shows for an email field that has no "@"
export const missingAtMessage = (email: string) =>
  `Please include an '@' in the email address. '${email}' is missing an '@'.`;

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
};

// The dedicated test account is never hardcoded; it comes from the environment
export const testAccount = () => ({
  email: requireEnv("TEST_USER_EMAIL"),
  password: requireEnv("TEST_USER_PASSWORD"),
});

export const SOME_PASSWORD = "SomePass123";

export const MASKED_PASSWORD = "Secret123!";
export const SHORT_VALID_EMAIL = "a@b.co";
export const SCRIPT_PASSWORD = "<script>alert(1)</script>";
export const LONG_PASSWORD = "a".repeat(300);
