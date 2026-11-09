// Pure helpers that turn numbers into the text the store shows, and back

export const parsePrice = (text: string) =>
  Number(text.replace(/[^0-9.]/g, ""));

export const formatMoney = (amount: number) =>
  `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const cartCountLabel = (count: number) => `My Cart (${count})`;

export const cartTotalLabel = (amount: number) =>
  `Total ${formatMoney(amount)}`;
