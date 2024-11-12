// @vitest-environment node
// see https://github.com/Hopding/pdf-lib/issues/1186

import { beratungshilfePdfFromUserdata } from "..";

describe("beratungshilfePdfFromUserdata", () => {
  it("values are set from context", async () => {
    const pdfDoc = await beratungshilfePdfFromUserdata({
      vorname: "vorname",
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });

  it("regression: documents are not changed by later instances", async () => {
    const pdfDoc = await beratungshilfePdfFromUserdata({
      vorname: "vorname",
      nachname: "nachname",
    });

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    await beratungshilfePdfFromUserdata({
      nachname: "nachname2",
      vorname: "vorname2",
    });

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });

  it("should handle special characters without throwing", async () => {
    const pdfDoc = await beratungshilfePdfFromUserdata({
      vorname: "Włodzimierz",
      nachname: "Ćwikła",
    });

    await expect(pdfDoc.save()).resolves.not.toThrow();
  });

  it("should handle emojis without throwing", async () => {
    const pdfDoc = await beratungshilfePdfFromUserdata({
      vorname: "🚂",
      nachname: "🫑",
    });

    await expect(pdfDoc.save()).resolves.not.toThrow();
  });
});
