import { test, expect } from "@playwright/test";
import { defaultHeaders } from "~/rootHeaders";

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
