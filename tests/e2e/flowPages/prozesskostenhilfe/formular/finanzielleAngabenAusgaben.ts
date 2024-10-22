import type { Page } from "@playwright/test";
import type { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";

export async function startFinanzielleAngabenAusgaben(
  page: Page,
  formular: ProzesskostenhilfeFormular,
) {
  // /finanzielle-angaben/eausgaben/ausgaben-frage
  await formular.fillRadioPage("hasAusgaben", "no");
}
