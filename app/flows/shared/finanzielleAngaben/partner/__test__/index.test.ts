import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";

const replacements = {
  backStep: "#einkommen.einkommen",
  playsNoRoleTarget: "#kinder.kinder-frage",
  partnerNameTarget: "#kinder.kinder-frage",
  partnerIncomeTarget: "partner-einkommen-summe",
  nextStep: "#kinder.kinder-frage",
} as const;

describe("getFinanzielleAngabenPartnerSubflow", () => {
  describe("beratungshilfeFormular target replacements", () => {
    const partnerSubflowJson = JSON.stringify(
      getFinanzielleAngabenPartnerSubflow(vi.fn(), replacements),
    );
    it.each(Object.entries(replacements))(
      "%s should be replaced by %s",
      (_, desiredReplacement) => {
        expect(partnerSubflowJson).toContain(desiredReplacement);
      },
    );
  });
});
