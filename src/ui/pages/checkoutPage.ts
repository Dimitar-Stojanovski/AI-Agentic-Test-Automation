import { BasePage } from "@pages/basePage";
import type { Locator } from "@playwright/test";

export class CheckoutPage extends BasePage {
  public readonly contactSection = this.page.getByRole("region", {
    name: "Contact",
  });
  public readonly emailField = this.page.getByRole("textbox", {
    name: "Email",
  });
  public readonly deliverySection = this.page.getByRole("heading", {
    level: 2,
    name: "Delivery",
  });
  public readonly countrySelect = this.page.getByRole("combobox", {
    name: "Country/Region",
  });
  public readonly orderSummaryHeading = this.page.getByRole("heading", {
    level: 2,
    name: "Order summary",
  });
  public readonly orderSummaryRows = this.page
    .getByRole("table", { name: "Shopping cart" })
    .getByRole("row");
  public readonly subtotalRow = this.page
    .getByRole("table", { name: "Cost summary" })
    .getByRole("row", { name: /^Subtotal/ });
  public readonly totalRow = this.page
    .getByRole("table", { name: "Cost summary" })
    .getByRole("row", { name: /^Total/ });

  orderSummaryRowFor(title: string) {
    return this.orderSummaryRows.filter({ hasText: title });
  }

  quantityCellOf(row: Locator) {
    return row.getByRole("cell", { name: /^Quantity/ });
  }
}
