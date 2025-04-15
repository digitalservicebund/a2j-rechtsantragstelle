import { PDFDocument } from "pdf-lib";
import { beratungshilfePdfFromUserdata } from "..";

describe("beratungshilfePdfFromUserdata", () => {
  const mockFlowId = "/beratungshilfe/antrag";
  const mockCookieHeader = "mock-cookie";
  it("values are set from context", async () => {
    const pdfDoc = await PDFDocument.load(
      await beratungshilfePdfFromUserdata({
        vorname: "vorname",
        nachname: "nachname",
      }, mockCookieHeader, mockFlowId),
    );

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });

  it("regression: documents are not changed by later instances", async () => {
    const pdfDoc = await PDFDocument.load(
      await beratungshilfePdfFromUserdata({
        vorname: "vorname",
        nachname: "nachname",
      }, mockCookieHeader, mockFlowId),
    );

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    await PDFDocument.load(
      await beratungshilfePdfFromUserdata({
        nachname: "nachname2",
        vorname: "vorname2",
      },mockCookieHeader, mockFlowId),
    );

    expect(pdfField.getText()).toEqual("nachname, vorname");
  });

  it("should handle special characters without throwing", async () => {
    const pdfDoc = await PDFDocument.load(
      await beratungshilfePdfFromUserdata({
        vorname: "Włodzimierz",
        nachname: "Ćwikła",
      },  mockCookieHeader, mockFlowId),
    );

    await expect(pdfDoc.save()).resolves.not.toThrow();
  });

  it("should handle emojis without throwing", async () => {
    const pdfDoc = await PDFDocument.load(
      await beratungshilfePdfFromUserdata({
        vorname: "🚂",
        nachname: "🫑",
      },  mockCookieHeader, mockFlowId),
    );

    await expect(pdfDoc.save()).resolves.not.toThrow();
  });
});
