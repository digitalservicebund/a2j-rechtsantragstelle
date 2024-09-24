import { test, expect } from "@playwright/test";
import { FluggastrechteFormular } from "tests/e2e/pom/FluggastrechteFormular";
import { FluggastrechteVorabcheck } from "tests/e2e/pom/FluggastrechteVorabcheck";
import { startFluggastrechteFormular } from "./startFluggastrechteFormular";
import { startFluggastrechteVorabcheckVerspaetung } from "../vorabcheck/vorabcheckVerspaetung";

let vorabcheck: FluggastrechteVorabcheck;
let formular: FluggastrechteFormular;

const getBaseUrlWithoutSlash = (baseUrlFromConfiguration: string): string => {
  if (baseUrlFromConfiguration.endsWith("/")) {
    return baseUrlFromConfiguration.substring(
      0,
      baseUrlFromConfiguration.length - 1,
    );
  }

  return baseUrlFromConfiguration;
};

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  formular = new FluggastrechteFormular(page);
});

test.describe("Fluggastrechte Formular", () => {
  test.skip("fluggastrechte from Vorabcheck to Klage Formular", async ({
    page,
  }) => {
    await startFluggastrechteVorabcheckVerspaetung(page, vorabcheck);
    await startFluggastrechteFormular(page, formular);
  });

  test("redirect to vorabcheck when goes to /fluggastrechte/formular/grundvorraussetzungen/redirect-vorabcheck", async ({
    baseURL,
  }) => {
    const baseUrlWithoutSlash = getBaseUrlWithoutSlash(baseURL ?? "");
    const redirectCheckUrl = `${baseUrlWithoutSlash}${formular.url}/grundvorraussetzungen/redirect-vorabcheck`;
    const redirectResponse = await fetch(redirectCheckUrl, {
      method: "GET",
      redirect: "manual",
    });
    const redirectLocation = redirectResponse.headers.get("Location");

    expect(redirectResponse.status).toEqual(302);
    expect(redirectLocation).toEqual("/fluggastrechte/vorabcheck/start");
  });
});
