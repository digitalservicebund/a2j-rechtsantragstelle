import { PDFDocument } from "pdf-lib";
import { beratungshilfePdfFromUserdata } from "..";

// NOTE: pdf tests are computationally expensive, therefore we have two expect() statements in this test
describe("beratungshilfePdfFromUserdata", () => {
  const mockSessionId = "mock-session-id";
  it("values are set from context, even for non-ascii and emojis", async () => {
    const pdfDoc = await PDFDocument.load(
      await beratungshilfePdfFromUserdata(
        { vorname: "Włodzimierz", nachname: "🫑" },
        mockSessionId,
      ),
    );

    const pdfField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    // regression: documents are independent
    const pdfDoc2 = await PDFDocument.load(
      await beratungshilfePdfFromUserdata(
        { nachname: "nachname2", vorname: "vorname2" },
        mockSessionId,
      ),
    );
    expect(pdfField.getText()).toEqual("🫑, Włodzimierz");

    const pdfFields2 = pdfDoc2
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");
    expect(pdfFields2.getText()).toEqual("nachname2, vorname2");
  });
});
