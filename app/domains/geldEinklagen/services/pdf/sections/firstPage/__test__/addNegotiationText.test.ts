import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addNegotiationText } from "../claimData/addNegotiationText";

describe("addNegotiationText", () => {
  it("should add oral negotiation text section if muendlicheVerhandlung is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "yes", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Es wird beantragt, eine mündliche Verhandlung nach §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
      expect.any(Number),
    );
  });

  it("should not add oral negotiation text section if muendlicheVerhandlung is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "no", mockStruct);
    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird beantragt, eine mündliche Verhandlung nach §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
      expect.any(Number),
    );
  });

  it("should add video negotiation and default judgment texts if videoVerhandlung and versaeumnisurteil are yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "yes", "no", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt. Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gem. § 331 Abs. 1 und Abs. 3 ZPO gestellt.",
      expect.any(Number),
    );
  });

  it("should add video negotiation and no default judgment texts if videoVerhandlung is yes and versaeumnisurteil is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "no", "no", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt. ",
      expect.any(Number),
    );
  });

  it("should add text when videoVerhandlung is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "no", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken. ",
      expect.any(Number),
    );
  });
});
