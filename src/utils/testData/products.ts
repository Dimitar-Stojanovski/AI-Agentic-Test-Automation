// Product handles and names are the only catalog data used. Prices are read
// from the product pages, never hardcoded.
export type Product = { handle: string; name: string };

// The handle "flower-print-jeans" belongs to the product named "Black heels"
export const HEELS: Product = {
  handle: "flower-print-jeans",
  name: "Black heels",
};
export const SANDALS: Product = {
  handle: "bronze-sandals",
  name: "Bronze sandals",
};
export const TOP: Product = { handle: "striped-top", name: "Striped top" };

export const SIZES = { medium: "M", large: "L" } as const;

export const LARGE_QUANTITY = 99999;
export const INVALID_QUANTITIES = ["abc", "-1", "2.5", ""];
