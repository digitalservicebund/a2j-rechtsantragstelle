import { pdfDateFormat, today } from "~/util/date";
import { getTitlePage } from "../getTitlePage";

describe("getTitlePage", () => {
  it("should return the original title if should not printing", () => {
    const originalTitle = "Original Title";
    const pathname = "/fluggastrechte/formular/some/path";
    const shouldPrint = false;

    const result = getTitlePage(originalTitle, pathname, shouldPrint);
    expect(result).toBe(originalTitle);
  });

  it("should return the original title if the pathname is not fluggastrechte formular", () => {
    const originalTitle = "Original Title";
    const pathname = "/some/path";
    const shouldPrint = true;

    const result = getTitlePage(originalTitle, pathname, shouldPrint);
    expect(result).toBe(originalTitle);
  });

  it("should return formatted title for fluggastrechte form", () => {
    const originalTitle = "Original Title";
    const pathname = "/fluggastrechte/formular/some/path";
    const shouldPrint = true;

    const result = getTitlePage(originalTitle, pathname, shouldPrint);
    expect(result).toBe(
      `Anleitung_Fluggastrechte_digitale_Klage_einreichen_${pdfDateFormat(today())}`,
    );
  });
});
