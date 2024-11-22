import type { ProzesskostenhilfeFormular } from "tests/e2e/domains/prozesskostenhilfe/formular/ProzesskostenhilfeFormular";

export async function startFinanzielleAngabenAusgaben(
  formular: ProzesskostenhilfeFormular,
) {
  // /finanzielle-angaben/eausgaben/ausgaben-frage
  await formular.fillRadioPage("hasAusgaben", "no");
}
