import type { Page } from "@playwright/test";
import type { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function startFinanzielleAngabenWohnung(
  page: Page,
  beratungshilfeFormular: BeratungshilfeFormular,
) {
  const stepCallbacks = [
    () =>
      beratungshilfeFormular.fillRadioPage("livingSituation", "withRelatives"),
    () => beratungshilfeFormular.fillInputPage("apartmentSizeSqm", "55"),
    () => beratungshilfeFormular.fillInputPage("apartmentPersonCount", "3"),
    () => beratungshilfeFormular.fillInput("apartmentCostFull", "800"),
    () => beratungshilfeFormular.fillInput("apartmentCostOwnShare", "40"),
  ];

  for await (const callback of stepCallbacks) {
    await expectPageToBeAccessible({ page });
    await callback();
  }
}
