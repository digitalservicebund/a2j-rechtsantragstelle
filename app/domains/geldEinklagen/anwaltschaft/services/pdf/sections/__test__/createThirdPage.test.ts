import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { createThirdPage } from "../createThirdPage";

describe("createThirdPage", () => {
  it("should print prozessuale Ausfuehrungen fields", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createThirdPage(doc, documentStruct, {
      ...emptyUserData,
      muendlicheVerhandlung: "on",
      videoverhandlung: "yes",
      versaeumnisurteil: "on",
    });

    expect(getPrintedText(doc)).toContain(
      "Mündliche Verhandlung/Videoverhandlung",
    );
    expect(
      getPrintedText(doc).some((text) =>
        text.includes("mündliche Verhandlung"),
      ),
    ).toBe(true);
    expect(getPrintedText(doc).some((text) => text.includes("per Video"))).toBe(
      true,
    );
    expect(
      getPrintedText(doc).some((text) => text.includes("Versäumnisurteils")),
    ).toBe(true);
  });

  it.each([
    ["no", "Bedenken"],
    ["noSpecification", undefined],
  ] as const)("handles videoverhandlung=%s", (videoverhandlung, expected) => {
    const { doc, documentStruct } = createPdfTestContext();

    createThirdPage(doc, documentStruct, {
      ...emptyUserData,
      videoverhandlung,
    });

    if (expected) {
      expect(getPrintedText(doc).some((text) => text.includes(expected))).toBe(
        true,
      );
    } else {
      expect(getPrintedText(doc)).not.toContain(
        "Mündliche Verhandlung/Videoverhandlung",
      );
    }
  });
});
