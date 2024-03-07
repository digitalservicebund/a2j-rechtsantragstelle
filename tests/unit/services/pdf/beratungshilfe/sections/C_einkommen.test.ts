import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillEinkommen } from "~/services/pdf/beratungshilfe/sections/C_einkommen";

describe("C_einkommen", () => {
  it("should fill einkommen pdf fields when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
      zusammenleben: "yes",
      partnerEinkommen: "no",
      einkommen: "100 €",
      partnerEinkommenSumme: "500 €",
    };
    const pdfFields = await getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c2Einkuenftenetto.value).toBe("100 €");
    expect(pdfFields.c3EinkuenftePartner.value).toBe(false);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe(undefined);
  });

  it("should fill einkommen pdf fields when context is given with partner", async () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      einkommen: "100 €",
      partnerEinkommenSumme: "200 €",
    };
    const pdfFields = await getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c2Einkuenftenetto.value).toBe("100 €");
    expect(pdfFields.c3EinkuenftePartner.value).toBe(true);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe("200 €");
  });
});
