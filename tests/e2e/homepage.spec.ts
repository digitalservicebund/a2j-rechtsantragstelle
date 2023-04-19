import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("links", () => {
  const expectedLinks = {
    Beratungshilfe: "/beratungshilfe",
    Impressum: "/impressum",
    Datenschutzerklärung: "/datenschutz",
  };

  let key: keyof typeof expectedLinks;
  for (key in expectedLinks) {
    const linkText = key;
    const url = expectedLinks[linkText];
    test(`${linkText} link`, async ({ page }) => {
      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes(url) && resp.status() === 200
      );
      await page.getByRole("link", { name: linkText }).click();
      await responsePromise;
    });
  }
});
