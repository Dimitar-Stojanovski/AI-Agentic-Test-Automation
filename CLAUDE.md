# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Run all tests: `npx playwright test`
- Run one spec: `npx playwright test tests/uiTests/login.spec.ts`
- Run one test by name: `npx playwright test -g "<test title>"`
- Lint: `npm run lint` (ESLint flat config in `eslint.config.mts`, uses `typescript-eslint`; `@typescript-eslint/no-unused-vars` is an error)
- Format: `npm run format:fix` (Prettier, default settings, no config file)
- Type-check: `npx tsc --noEmit -p tsconfig.json`

There is no build step; Playwright transpiles TypeScript itself.

## Commit hook

Husky runs `.husky/pre-commit` → `lint-staged` (config in `package.json`): ESLint with `--max-warnings=0` on staged JS/TS files, and `prettier --check` on all staged files. Prettier only _checks_; it does not rewrite. A failing commit tells you to run `npm run format:fix`, then re-stage. The hook is registered by `npm install` (`prepare` script sets `core.hooksPath`).

## Environment

`playwright.config.ts` loads `<TEST_ENV>.env` (default `qa.env`) via dotenv and exposes `BASE_URL` as Playwright's `baseURL`. Page objects therefore navigate with root-relative paths (`page.goto("/account/login")`). `*.env` is gitignored, so `qa.env` must exist locally (target: `https://sauce-demo.myshopify.com/`). Select another environment with `TEST_ENV=<name>` and a matching `<name>.env`.

## Architecture

UI tests follow a page object + fixture pattern split across `src/` and `tests/`:

- `src/ui/pages/` — page objects. All extend the abstract `BasePage` (`basePage.ts`), which holds `page` and exposes `protected` wrappers (`clickOn`, `fillIn`, `selectFromDropdown`, `waitForElement`). Page objects interact with the page through these wrappers, and expose assertions-ready `Locator`s publicly (e.g. `errorMessage`) so specs do the `expect`.
- `src/utils/uiUtils/uiFixtures.ts` — the single fixture entry point. It extends Playwright's `test` with one fixture per page object and re-exports `expect`. **Specs must import `test`/`expect` from here, not from `@playwright/test`**, and a new page object needs a matching entry added to the `UiFixtures` type and `base.extend` call.
- `tests/uiTests/` — specs (`*.spec.ts`), consuming page objects through fixtures. `tests/apiTests/` exists for API tests (currently empty).

### Conventions

- Locators are declared as class property initializers using `this.page` (no constructor in page subclasses); the base constructor sets `page` first.
- Import with the tsconfig path aliases, not relative paths: `@pages/*` → `src/ui/pages/*`, `@utils/*` → `src/utils/*` (e.g. `@pages/basePage`, `@utils/uiUtils/uiFixtures`). Playwright resolves these at runtime from `tsconfig.json`. If the Playwright VS Code extension reports "Cannot find module" for an alias, reload the window; the CLI is the source of truth.
- Code is formatted with Prettier defaults (double quotes, 2-space indent, trailing commas).
