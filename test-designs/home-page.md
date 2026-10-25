# Home page test cases

## Notes

**Scope:** Only what is displayed on the home page `https://sauce-demo.myshopify.com/`: header, logo and tagline, sidebar menu, social icons, featured products, footer and the search box. These are display and presence checks only, at desktop width. Following links, search results, the cart, the Sauce wish list and refer-a-friend overlays, checkout, and mobile or responsive layout are out of scope.

**Live-page observations (2026-10-25, desktop width 1280px):**

- The browser tab title is "Sauce Demo".
- Header, top left: a search box with the placeholder "Search" and a magnifier icon button. Top centre: links "Search", "About Us", "Log In" and "Sign up". Top right: a cart icon with "My Cart (0)", then "Check Out".
- Below the header: a logo image that reads "simple." (its alternative text is "Sauce Demo") and links to the home page. On the right is the tagline "Just a demo site showing off what Sauce can do."
- Left sidebar menu: Home, Catalog, Blog, About Us, Wish list, Refer a friend. Below it are five round icons: Facebook, Twitter, Instagram, Pinterest and RSS.
- Main area: a grid of featured ("frontpage" collection) products. Each tile shows an image, the product name and a price in GBP (£). There were 3 tiles and none was marked Sold Out. The page has **no hero banner or slideshow**.
- Footer: a column headed "Footer" with the links Search and About Us. An "About Us" column holds a short text about Sauce with a "Sauce" link. Amex, Visa and Mastercard logos are shown. The bottom bar shows "Copyright © <current year> Sauce Demo. Shopping Cart by Shopify." and the links Search and About Us.
- No CAPTCHA or bot wall appeared.

**Confirmed by the product owner:**

- The logo image reading "simple." with the alternative text "Sauce Demo" is intended.
- The footer column heading "Footer" is intended.
- The home page always shows exactly 3 featured products.
- Only the desktop layout is in scope.

**Assumptions:** The test starts in a new browser session with an empty cart, at desktop width. Product names and prices can change, so the expected results do not name them.

**Suspected defects (to be confirmed):**

- The five social icon links have no text, title or accessible label, so screen readers cannot announce them.
- The search submit button (magnifier icon) has no accessible label.

## Test cases

### TC-HOME-01: Home page loads with the correct title

**Description:** Verifies the home page opens without errors and has the expected browser title. This is the baseline for all other home page checks.
**Priority:** P1

**Steps:**

1. Open `https://sauce-demo.myshopify.com/` in a new browser session.

**Expected results:**

- The page loads without an error page or a blank screen.
- The browser tab title is "Sauce Demo".
- The URL is `https://sauce-demo.myshopify.com/`.

### TC-HOME-02: Header links and cart summary are displayed

**Description:** Verifies the global header shows all account, content and cart entry points to a new shopper.
**Priority:** P1

**Steps:**

1. Open the home page in a new browser session.
2. Look at the header at the top of the page.

**Expected results:**

- The links "Search", "About Us", "Log In" and "Sign up" are visible.
- A cart icon with the text "My Cart (0)" is visible.
- A "Check Out" link is visible next to the cart summary.

### TC-HOME-03: Header search box is present

**Description:** Verifies the search box is shown in the header and is ready for input. Running a search is out of scope.
**Priority:** P2

**Steps:**

1. Open the home page in a new browser session.
2. Look at the top left corner of the header.

**Expected results:**

- An empty text box with the placeholder text "Search" is visible.
- A magnifier icon button is shown next to the box.

### TC-HOME-04: Logo and tagline are displayed

**Description:** Verifies the store branding area below the header.
**Priority:** P2

**Steps:**

1. Open the home page in a new browser session.
2. Look at the area below the header.

**Expected results:**

- A logo image that reads "simple." is shown at the left and loads fully (no broken-image icon). Its alternative text is "Sauce Demo".
- Hovering over the logo shows it is a link (the mouse pointer changes).
- The tagline "Just a demo site showing off what Sauce can do." is shown on the right.

### TC-HOME-05: Sidebar menu items are displayed

**Description:** Verifies the main navigation menu shows all items in the expected order.
**Priority:** P1

**Steps:**

1. Open the home page in a new browser session.
2. Look at the menu in the left sidebar.

**Expected results:**

- The menu shows these items from top to bottom: "Home", "Catalog", "Blog", "About Us", "Wish list", "Refer a friend".

### TC-HOME-06: Social media icons are displayed

**Description:** Verifies the social icons are shown below the sidebar menu.
**Priority:** P3

**Steps:**

1. Open the home page in a new browser session.
2. Look below the sidebar menu.

**Expected results:**

- Five round icons are visible in a row: Facebook, Twitter, Instagram, Pinterest and RSS.

### TC-HOME-07: Featured products are displayed

**Description:** Verifies the featured product grid shows exactly 3 complete product tiles. Product names and prices are live data, so they are not hardcoded.
**Priority:** P1

**Steps:**

1. Open the home page in a new browser session.
2. Look at the main content area to the right of the sidebar.

**Expected results:**

- Exactly 3 product tiles are shown.
- Each tile shows a product image that loads fully, a product name below the image and a price below the name.
- Each price is shown in GBP with the "£" sign and two decimal places (for example "£xx.xx").
- No hero banner or slideshow is shown above the products.

### TC-HOME-08: Footer content is displayed

**Description:** Verifies the footer shows its links, the About Us text and the accepted payment card logos.
**Priority:** P2

**Steps:**

1. Open the home page in a new browser session.
2. Scroll to the bottom of the page.

**Expected results:**

- A footer column headed "Footer" shows the links "Search" and "About Us".
- An "About Us" column shows a short text that starts "This is a demo site created for Sauce", and "Sauce" in that text is a link.
- The Amex, Visa and Mastercard card logos are shown and load fully.

### TC-HOME-09: Footer copyright bar is displayed

**Description:** Verifies the bottom bar of the page shows the copyright notice and its links.
**Priority:** P3

**Steps:**

1. Open the home page in a new browser session.
2. Scroll to the very bottom of the page.

**Expected results:**

- The text "Copyright © <current year> Sauce Demo." is shown, with the current calendar year.
- "Shopping Cart by Shopify" is shown as a link.
- The links "Search" and "About Us" are shown at the right of the bar.

### TC-HOME-10: Icon links and icon buttons have accessible names

**Description:** Verifies that screen-reader users can identify the icon-only controls on the home page. In live inspection these controls had no accessible name (suspected defect).
**Priority:** P3

**Steps:**

1. Open the home page in a new browser session.
2. Turn on a screen reader (for example NVDA or VoiceOver).
3. Press Tab to move focus to the search magnifier button.
4. Keep pressing Tab until focus reaches each of the five social icons below the sidebar menu.

**Expected results:**

- The magnifier button is announced with a meaningful name, such as "Search".
- Each social icon is announced with its network name: "Facebook", "Twitter", "Instagram", "Pinterest", "RSS".
- Observed on 2026-10-25: these controls had no text, title or label. Expected wording is to be confirmed.
