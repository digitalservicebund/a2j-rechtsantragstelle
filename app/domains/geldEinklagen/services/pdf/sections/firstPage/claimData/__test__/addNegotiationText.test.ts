import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addNegotiationText } from "../addNegotiationText";

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
      "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.",
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gem. § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt.",
      expect.any(Number),
    );
  });

  it("should add video negotiation and no default judgment texts if videoVerhandlung is yes and versaeumnisurteil is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "no", "no", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.",
      expect.any(Number),
    );
  });

  it("should add text when videoVerhandlung is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "no", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Gegen die Durchführung einer Verhandlung per Video bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.",
      expect.any(Number),
    );
  });

  it("should add an empty row after video negotiation text when default judgment text follows", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "yes", "no", mockStruct);

    expect(mockDoc.moveDown).toHaveBeenCalledWith(1);
  });

  it("should not create a paragraph structure element when all negotiation texts are empty", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "noSpecification", "no", "no", mockStruct);

    expect(mockDoc.struct).not.toHaveBeenCalled();
    expect(mockStruct.add).not.toHaveBeenCalled();
    expect(mockDoc.text).not.toHaveBeenCalled();
  });
});
