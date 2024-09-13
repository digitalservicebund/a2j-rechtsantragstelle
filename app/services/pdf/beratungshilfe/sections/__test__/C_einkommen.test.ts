import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillEinkommen } from "~/services/pdf/beratungshilfe/sections/C_einkommen";

describe("C_einkommen", () => {
  it("should fill partner einkommen pdf fields when context is partner", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      einkommen: "100 €",
      partnerEinkommenSumme: "200 €",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c2Einkuenftenetto.value).toBe("100 €");
    expect(pdfFields.c3EinkuenftePartner.value).toBe(true);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe("200 €");
  });
});
