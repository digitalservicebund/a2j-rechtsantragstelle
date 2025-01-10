import { test, expect } from "@playwright/test";
import { defaultHeaders } from "~/rootHeaders";

const expectedHeaders = {
  ...defaultHeaders,
  "Cache-Control": "no-store",
  Connection: "keep-alive",
  "Content-Encoding": "gzip",
  "Content-Type": "text/html; charset=utf-8",
  "Transfer-Encoding": "chunked",
  Vary: "Accept-Encoding",
};

test.describe("Security Tests", () => {
  test("The server should send a response including the correct response headers", async ({
    page,
  }) => {
    const response = await page.request.get("/");
    await expect(response).toBeOK();
    Object.entries(expectedHeaders)
      .map(([key, val]) => [key.toLocaleLowerCase(), val])
      .forEach(([key, expectedVal]) => {
        const actualValue = response.headers()[key];
        const responseHasExpectedHeader = actualValue === expectedVal;
        if (!responseHasExpectedHeader) {
          // eslint-disable-next-line no-console
          console.warn(
            `Header ${key} was expected to be ${expectedVal} but instead was ${actualValue}`,
          );
        }
        expect(responseHasExpectedHeader).toBe(true);
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
