import { type Page, type Response, expect } from "@playwright/test";

interface CacheControlOptions {
  page: Page;
  navigate: () => Promise<Response | null>;
  url: string;
  header: string;
  expectedValue: string | null;
}

export const verifyHeader = async ({
  page,
  navigate,
  url,
  header,
  expectedValue,
}: CacheControlOptions) => {
  const promiseResponse = page.waitForResponse((response) =>
    response.url().includes(url),
  );
  await navigate();
  const response = await promiseResponse;
  expect(await response.headerValue(header)).toEqual(expectedValue);
};
