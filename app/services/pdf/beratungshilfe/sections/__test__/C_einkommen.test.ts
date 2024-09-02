import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillEinkommen } from "~/services/pdf/beratungshilfe/sections/C_einkommen";

describe("C_einkommen", () => {
  it("should fill einkommen pdf fields when partnerschaft is not in context", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
      einkommen: "100 €",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c2Einkuenftenetto.value).toBe("100 €");
    expect(pdfFields.c3EinkuenftePartner.value).toBe(undefined);
  });

  it("should not fill partner einkommen pdf fields when no partner given in context", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
      einkommen: "100 €",
      partnerEinkommenSumme: "500 €",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c3EinkuenftePartner.value).toBe(undefined);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe(undefined);
  });

  it("should not fill partner einkommen pdf fields when partnerschaft yes but zusammenleben no in context", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "no",
      partnerEinkommen: "yes",
      einkommen: "100 €",
      partnerEinkommenSumme: "500 €",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c3EinkuenftePartner.value).toBe(undefined);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe(undefined);
  });

  it("should not fill partner einkommen pdf fields when partnerschaft yes but partnerEinkommen no in context", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "no",
      einkommen: "100 €",
      partnerEinkommenSumme: "500 €",
    };
    const pdfFields = getBeratungshilfeParameters();

    fillEinkommen(pdfFields, context);

    expect(pdfFields.c3EinkuenftePartner.value).toBe(undefined);
    expect(pdfFields.c4EinkuenftePartnernetto.value).toBe(undefined);
  });

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
