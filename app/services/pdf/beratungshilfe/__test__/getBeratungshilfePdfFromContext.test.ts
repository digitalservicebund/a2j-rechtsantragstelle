// @vitest-environment node
// see https://github.com/Hopding/pdf-lib/issues/1186
import { getBeratungshilfePdfFromContext } from "../beratungshilfe.server";

describe("getBeratungshilfePdfFromContext", () => {
  it("values are set from context", async () => {
    const pdfDoc = await getBeratungshilfePdfFromContext({
      vorname: "vorname",
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });

  it("regression: documents are not changed by later instances", async () => {
    const pdfDoc = await getBeratungshilfePdfFromContext({
      vorname: "vorname",
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    await getBeratungshilfePdfFromContext({
      nachname: "nachname2",
      vorname: "vorname2",
    });

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });
});
