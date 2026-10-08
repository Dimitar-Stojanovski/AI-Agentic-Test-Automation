import { Locator, Page } from "@playwright/test";

type ClickOptions = Parameters<Locator["click"]>[0];
type FillOptions = Parameters<Locator["fill"]>[1];
type SelectOptions = Parameters<Locator["selectOption"]>[1];
type WaitForOptions = Parameters<Locator["waitFor"]>[0];

export abstract class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
