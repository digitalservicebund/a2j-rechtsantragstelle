import { finanzielleAngabenPartnerTargetReplacements as beratungsHilfeTargetReplacements } from "~/flows/beratungshilfeFormular/finanzielleAngaben/xstateConfig";
import { getFinanzielleAngabenPartnerSubflow } from "~/flows/shared/finanzielleAngaben/partner";

describe("getFinanzielleAngabenPartnerSubflow", () => {
  describe("beratungshilfeFormular target replacements", () => {
    it.each(Object.entries(beratungsHilfeTargetReplacements))(
      "%s should be replaced by %s",
      (_targetName, desiredReplacement) => {
        const partnerSubflow = getFinanzielleAngabenPartnerSubflow(
          vi.fn(),
          beratungsHilfeTargetReplacements,
        );
        expect(JSON.stringify(partnerSubflow)).toContain(desiredReplacement);
      },
    );
  });
});
