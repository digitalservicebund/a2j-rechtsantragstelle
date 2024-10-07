import { describe, it, expect } from "vitest";
import { createHeaders } from "../pdfDownloadLoader";

describe("createHeaders", () => {
  it("should handle a filename without special characters", () => {
    const filename = "Antrag_Beratungshilfe_Kunze_311299.pdf";

    const headers = createHeaders(filename, 10);

    expect(headers["Content-Type"]).toBe("application/pdf");
    expect(headers["Content-Disposition"]).toBe(
      "inline; filename*=UTF-8''Antrag_Beratungshilfe_Kunze_311299.pdf",
    );
  });

  it("should handle a filename with special characters", () => {
    const filename = "Antrag_Prozesskostenhilfe_Ćwikła_311299.pdf";

    const headers = createHeaders(filename, 10);

    expect(headers["Content-Type"]).toBe("application/pdf");
    expect(headers["Content-Disposition"]).toBe(
      "inline; filename*=UTF-8''Antrag_Prozesskostenhilfe_%25C4%2586wik%25C5%2582a_311299.pdf",
    );
  });

  it("should handle filename with space and line break characters", () => {
    const filename = "Antrag_Beratungshilfe_Master\nO Splinter_311299.pdf";

    const headers = createHeaders(filename, 10);

    expect(headers["Content-Type"]).toBe("application/pdf");
    expect(headers["Content-Disposition"]).toBe(
      "inline; filename*=UTF-8''Antrag_Beratungshilfe_Master%250AO%2520Splinter_311299.pdf",
    );
  });
});
