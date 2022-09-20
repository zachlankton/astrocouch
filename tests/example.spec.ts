import { test, expect } from "@playwright/test";

test("homepage has Astro in title and CouchDB UI link linking to the CouchDB Admin Page", async ({
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

test("Test CouchDB UI can login", async ({ page }) => {
  await page.goto("http://localhost:5984/_utils");

  // login to
  await page.locator("#username").fill("admin");
  await page.locator("#password").fill("admin");
  await page.locator("#password").press("Enter");

  const LogOutButton = page.locator("text=Log Out").first();

  await expect(LogOutButton).toBeVisible();
});
