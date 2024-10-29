import { type BeratungshilfeFormularContext } from "app/flows/beratungshilfe/formular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillEinkommen } from "~/services/pdf/beratungshilfe/sections/C_einkommen";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";

describe("C_einkommen", () => {
  it("should fill partner einkommen pdf fields when context is partner", () => {
    const userData: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      einkommen: "100 €",
      partnerEinkommenSumme: "200 €",
    };
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillEinkommen],
    });

    expect(pdfValues.c2Einkuenftenetto.value).toBe("100 €");
    expect(pdfValues.c3EinkuenftePartner.value).toBe(true);
    expect(pdfValues.c4EinkuenftePartnernetto.value).toBe("200 €");
  });
});
