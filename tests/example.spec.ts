import { test, expect } from "@playwright/test";

test("homepage has Playwright in title and get started link linking to the intro page", async ({
  page,
}) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Astro/);

  // create a locator
  const couchDBButton = page
    .locator("a", { has: page.locator("text=CouchDB") })
    .first();

  // Expect an attribute "to be strictly equal" to the value.
  await expect(couchDBButton).toHaveAttribute(
    "href",
    "http://localhost:5984/_utils"
  );

  // Click the get started link.
  await couchDBButton.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*utils/);
});
