import { describe, it, expect } from "vitest";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { today, toGermanDateFormat } from "~/util/date";
import { fillFooter } from "../K_footer";

let pdfParams: ProzesskostenhilfePDF;

describe("fillFooter", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  it("should fill ortDatum with the correct format", () => {
    const userData = { ort: "berlin" };
    const result = fillFooter({ userData, pdfValues: pdfParams });

    expect(result.pdfValues.ortDatum.value).toBe(
      `Berlin, ${toGermanDateFormat(today())}`,
    );
  });

  it("should handle empty ort", () => {
    const userData = { ort: "" };
    const result = fillFooter({ userData, pdfValues: pdfParams });

    expect(result.pdfValues.ortDatum.value).toBe(
      `, ${toGermanDateFormat(today())}`,
    );
  });

  it("should handle undefined ort", () => {
    const userData = { ort: undefined };
    const result = fillFooter({ userData, pdfValues: pdfParams });

    expect(result.pdfValues.ortDatum.value).toBe(
      `, ${toGermanDateFormat(today())}`,
    );
  });
});
