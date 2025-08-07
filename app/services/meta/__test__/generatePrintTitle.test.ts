import { pdfDateFormat, today } from "~/util/date";
import { generatePrintTitle } from "../generatePrintTitle";

describe("generatePrintTitle", () => {
  it("should return the original title if the pathname is not fluggastrechte formular", () => {
    const originalTitle = "Original Title";
    const pathname = "/some/path";

    const result = generatePrintTitle(originalTitle, pathname);
    expect(result).toBe(originalTitle);
  });

  it("should return formatted title for fluggastrechte form", () => {
    const originalTitle = "Original Title";
    const pathname = "/fluggastrechte/formular/some/path";

    const result = generatePrintTitle(originalTitle, pathname);
    expect(result).toBe(
      `Anleitung_Fluggastrechte_digitale_Klage_einreichen_${pdfDateFormat(today())}`,
    );
  });
});
