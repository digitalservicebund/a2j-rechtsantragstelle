import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillEinkommen } from "../C_einkommen";

describe("C_einkommen", () => {
  it("should fill partner einkommen pdf fields when context is partner", () => {
    const userData: BeratungshilfeFormularUserData = {
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
