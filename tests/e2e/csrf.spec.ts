import { test, expect } from "@playwright/test";
import { Vorabcheck } from "./pom/Vorabcheck";
import { csrfCountMax } from "~/services/security/csrf.server";

test.describe("CSRF token", () => {
  test("multiple tabs work", async ({ page, context }) => {
    const vorabcheck = new Vorabcheck(page);
    await vorabcheck.goto();
    const vorabcheck2 = new Vorabcheck(await context.newPage());
    await vorabcheck2.goto();
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
    await expect(
      vorabcheck.page
        .getByRole("heading")
        .filter({ hasText: "Gerichtsverfahren" }),
    ).toHaveCount(1);
  });

  test("N+1 form tabs return 403", async ({ page, context }) => {
    const vorabcheck = new Vorabcheck(page);
    await vorabcheck.goto();

    for (let idx = 0; idx < csrfCountMax; idx++) {
      const newPage = new Vorabcheck(await context.newPage());
      await newPage.goto();
    }
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
    await expect(vorabcheck.page.getByText("403")).toHaveCount(1);
  });

  test("N+1 non-form tabs still work", async ({ page, context }) => {
    const vorabcheck = new Vorabcheck(page);
    await vorabcheck.goto();

    for (let idx = 0; idx < csrfCountMax; idx++) {
      await (await context.newPage()).goto("/");
    }
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
    await expect(
      vorabcheck.page
        .getByRole("heading")
        .filter({ hasText: "Gerichtsverfahren" }),
    ).toHaveCount(1);
  });
});
