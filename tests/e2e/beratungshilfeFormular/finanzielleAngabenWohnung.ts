import type { Page } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import type { BeratungshilfeFormular } from "../pom/BeratungshilfeFormular";

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
