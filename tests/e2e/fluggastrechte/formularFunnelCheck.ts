import { expect, Page } from "@playwright/test";
import { FluggastrechteFormular } from "../pom/FluggastrechteFormular";

export async function startFluggastrechteFunnelCheck(
  page: Page,
  formular: FluggastrechteFormular,
) {
  await page.goto(`${formular.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${formular.url}/${formular.initialStep}$`),
  );

  await page.goto(`${formular.url}/versand/einverstaendnis`);
  await expect(page).toHaveURL(
    new RegExp(`.+${formular.url}/versand/einverstaendnis$`),
  );
}
