import { test, expect } from "@playwright/test";
import { acceptCookiesFieldName } from "~/components/cookieBanner/CookieBanner";
import { defaultHeaders } from "~/rootHeaders";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";

const deniedConsentCookieValue = btoa(
  JSON.stringify({ [acceptCookiesFieldName]: false }),
);

test.describe("Security Tests", () => {
  test("server response includes security headers", async ({ page }) => {
    const response = await page.request.get("/");
    await expect(response).toBeOK();
    const headers = response.headers();
    Object.entries(defaultHeaders).forEach(([key, expectedVal]) => {
      const actual = headers[key.toLowerCase()];
      expect(actual, `Header '${key}' matches`).toBe(expectedVal);
    });
  });

  test.describe("Cache", () => {
    ["/", "/beratungshilfe/vorabcheck"].forEach((url) => {
      test(`disabled without cookie interaction on '${url}'`, async ({
        page,
      }) => {
        const response = await page.request.get(url);
        await expect(response).toBeOK();
        expect(response.headers()["cache-control"]).toBe("no-store");
      });
    });

    test("Cache is kept on content pages after cookie interaction", async ({
      page,
      context,
    }) => {
      await context.addCookies([
        {
          name: consentCookieName,
          value: deniedConsentCookieValue,
          path: "/",
          domain: "localhost",
        },
      ]);
      const response = await page.goto("/");
      expect(response).not.toBeNull();
      expect(response!.headers()["cache-control"]).toBeUndefined();
    });
  });

  test("Invalid HTTP operations should yield an error", async ({ page }) => {
    const postResponse = await page.request.post("/");
    await expect(postResponse).not.toBeOK();
    expect(postResponse.status()).toBe(405);

    const putResponse = await page.request.put("/");
    await expect(putResponse).not.toBeOK();
    expect(putResponse.status()).toBe(405);

    const deleteResponse = await page.request.delete("/");
    await expect(deleteResponse).not.toBeOK();
    expect(deleteResponse.status()).toBe(405);

    const patchResponse = await page.request.patch("/");
    await expect(patchResponse).not.toBeOK();
    expect(patchResponse.status()).toBe(405);
  });
});
