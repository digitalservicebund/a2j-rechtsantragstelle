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
    const headers = Object.entries(response.headers());
    Object.entries(expectedHeaders)
      .map(([key, val]) => [key.toLocaleLowerCase(), val])
      .forEach(([key, expectedVal]) => {
        const responseHasExpectedHeader = headers.some(
          ([name, value]) => name === key && value === expectedVal,
        );
        if (!responseHasExpectedHeader) {
          // eslint-disable-next-line no-console
          console.warn(
            `Header ${key} with value ${expectedVal} was not found in the response`,
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
