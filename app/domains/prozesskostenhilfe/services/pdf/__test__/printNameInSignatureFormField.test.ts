import fs from "fs";
import fontkit from "@pdf-lib/fontkit";
import type { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { printNameInSignatureFormField } from "../printNameInSignatureFormField";

vi.mock("fs");
vi.mock("@pdf-lib/fontkit");
vi.mock("pdf-lib", async () => {
  const original = await vi.importActual("pdf-lib");
  return {
    ...original,
    PDFDocument: vi.fn(() => ({
      getPage: vi.fn(),
    })),
  };
});

const mockPdfDoc = {
  getPage: vi.fn().mockReturnValue({
    drawText: vi.fn(),
  }),
  registerFontkit: vi.fn(),
  embedFont: vi.fn(),
} as unknown as PDFDocument;

describe("printNameInSignatureFormField", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call drawText with correct arguments when versandArt is "digital"', async () => {
    const userData: ProzesskostenhilfeFormularUserData = {
      vorname: "Rosa",
      nachname: "Ritter",
      versandArt: "digital",
    };
    await printNameInSignatureFormField(mockPdfDoc, userData);
    expect(mockPdfDoc.getPage(3).drawText).toHaveBeenCalledWith("Rosa Ritter", {
      x: 200,
      y: 75,
      size: 10,
    });
  });

  it('should not call drawText when versandArt is "analog"', async () => {
    const userDataAnalog: ProzesskostenhilfeFormularUserData = {
      vorname: "Rosa",
      nachname: "Ritter",
      versandArt: "analog",
    };
    await printNameInSignatureFormField(mockPdfDoc, userDataAnalog);
    expect(mockPdfDoc.getPage(3).drawText).not.toHaveBeenCalled();
  });

  it("should handle correctly special characters", async () => {
    const userData: ProzesskostenhilfeFormularUserData = {
      vorname: "Włodzimierz",
      nachname: "Ćwikłań",
      versandArt: "digital",
    };
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from("mock font data"));

    await printNameInSignatureFormField(mockPdfDoc, userData);

    expect(mockPdfDoc.registerFontkit).toHaveBeenCalledWith(fontkit);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      "public/fonts/BundesSansWeb-Regular.woff",
    );
    expect(mockPdfDoc.embedFont).toHaveBeenCalledWith(
      Buffer.from("mock font data"),
      { subset: true },
    );

    expect(mockPdfDoc.getPage(3).drawText).toHaveBeenCalledWith(
      "Włodzimierz Ćwikłań",
      {
        x: 200,
        y: 75,
        size: 10,
      },
    );
  });
});
