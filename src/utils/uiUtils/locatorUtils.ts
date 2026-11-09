import type { Locator } from "@playwright/test";

export const allImagesLoaded = (images: Locator) =>
  images.evaluateAll((elements: HTMLImageElement[]) =>
    elements.every((image) => image.complete && image.naturalWidth > 0),
  );

// Returns the bounding box, or fails with a clear message when the element is not rendered
export const boxOf = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (box === null) {
    throw new Error(
      `No bounding box for ${locator}; the element is not visible`,
    );
  }
  return box;
};
