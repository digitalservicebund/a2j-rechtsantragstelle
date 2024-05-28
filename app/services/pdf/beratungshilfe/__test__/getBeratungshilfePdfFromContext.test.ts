/**
 * @jest-environment node
 */
import { getBeratungshilfePdfFromContext } from "../beratungshilfe.server";

describe("getBeratungshilfePdfFromContext", () => {
  it("values are set from context", async () => {
    const pdfDoc = await getBeratungshilfePdfFromContext({
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(pdfField.getText()).toEqual("nachname");
  });

  it("regression: documents are not changed by later instances", async () => {
    const pdfDoc = await getBeratungshilfePdfFromContext({
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    await getBeratungshilfePdfFromContext({ nachname: "nachname2" });

    expect(pdfField.getText()).toEqual("nachname");
  });
});
