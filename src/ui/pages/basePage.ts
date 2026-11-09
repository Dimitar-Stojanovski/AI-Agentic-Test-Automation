import { Locator, Page } from "@playwright/test";

type GotoOptions = Parameters<Page["goto"]>[1];
type ClickOptions = Parameters<Locator["click"]>[0];
type FillOptions = Parameters<Locator["fill"]>[1];
type PressOptions = Parameters<Locator["press"]>[1];
type SelectOptions = Parameters<Locator["selectOption"]>[1];
type WaitForOptions = Parameters<Locator["waitFor"]>[0];

export abstract class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Product tiles are shared by the home page and the catalog. A getter is used
  // because property initializers of the base class run before `page` is set.
  protected get productTileLinks(): Locator {
    return this.page
      .getByRole("link")
      .filter({ has: this.page.getByRole("heading", { level: 3 }) });
  }

  protected navigateTo(path: string, options?: GotoOptions) {
    return this.page.goto(path, options);
  }

  protected async clickOn(locator: Locator, options?: ClickOptions) {
    await locator.click(options);
  }

  protected async fillIn(
    locator: Locator,
    text: string,
    options?: FillOptions,
  ) {
    await locator.fill(text, options);
  }

  protected async focusOn(locator: Locator) {
    await locator.focus();
  }

  protected async pressKey(
    locator: Locator,
    key: string,
    options?: PressOptions,
  ) {
    await locator.press(key, options);
  }

  protected async selectFromDropdown(
    locator: Locator,
    value: string,
    options?: SelectOptions,
  ) {
    await locator.selectOption(value, options);
  }

  protected async waitForElement(locator: Locator, options?: WaitForOptions) {
    await locator.waitFor(options);
  }
}
