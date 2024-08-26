import { test, expect } from "@playwright/test";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("homepage", () => {
  testPageToBeAccessible();

  test("BMF logo is displayed", async ({ page }) => {
    const allImages = await page.getByRole("img").all();
    expect(allImages.length).toBeGreaterThan(0);
    await expect(allImages[0]).toBeVisible();
  });

  test.describe("Header links", () => {
    test("Accessibility links are visible from the homepage", async ({
      page,
    }) => {
      await expect(page.getByLabel("Leichte Sprache")).toBeVisible();
      await expect(page.getByLabel("Gebärdensprache")).toBeVisible();
    });

    Object.entries({
      "Leichte Sprache": "/leichtesprache",
      Gebärdensprache: "/gebaerdensprache",
    }).forEach((entry) => {
      const [pageName, url] = entry;
      test(`${pageName} accessibility link correctly navigates to ${url}`, async ({
        page,
      }) => {
        const responsePromise = page.waitForResponse(
          (resp) => resp.url().includes(url) && resp.status() === 200,
        );
        await page.getByLabel(pageName).click();
        await responsePromise;
      });
    });
  });

  test.describe("Footer links", () => {
    const expectedLinks = {
      Impressum: "/impressum",
      // Nutzungsbedingungen: "/nutzungsbedingungen",
      Datenschutzbestimmung: "/datenschutz",
      "Cookie-Einstellungen": "/cookie-einstellungen",
      Barrierefreiheit: "/barrierefreiheit",
      // Pressekontakt: "/pressekontakt",
    };

    let key: keyof typeof expectedLinks;
    for (key in expectedLinks) {
      const linkText = key;
      const url = expectedLinks[linkText];
      test(`${linkText}`, async ({ page }) => {
        const responsePromise = page.waitForResponse(
          (resp) => resp.url().includes(url) && resp.status() === 200,
        );
        await page
          .getByTestId("footer")
          .getByRole("link", { name: linkText })
          .click();
        await responsePromise;
      });
    }
  });
});
