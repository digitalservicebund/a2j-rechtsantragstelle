import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addNegotiationText } from "~/domains/geldEinklagen/services/pdf/sections/firstPage/claimData/addNegotiationText";

describe("addNegotiationText", () => {
  it('should show title "Mündliche Verhandlung" when muendlicheVerhandlung content is visible', () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "noSpecification", "no", "yes", mockStruct);

    expect(mockDoc.text).toHaveBeenCalledWith("Mündliche Verhandlung:");
  });

  it('should show title "Mündliche Verhandlung" when videoVerhandlung content is visible', () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "no", "no", mockStruct);

    expect(mockDoc.text).toHaveBeenCalledWith("Mündliche Verhandlung:");
  });

  it('should not show title "Mündliche Verhandlung" when no oral or video content is visible', () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "noSpecification", "no", "no", mockStruct);

    expect(mockDoc.text).not.toHaveBeenCalledWith("Mündliche Verhandlung");
  });

  it('should show title "Versäumnisurteil" when versaeumnisurteil is yes', () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "noSpecification", "yes", "no", mockStruct);

    expect(mockDoc.text).toHaveBeenCalledWith("Versäumnisurteil:");
  });

  it('should not show title "Versäumnisurteil" when versaeumnisurteil is no', () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "yes", "no", "no", mockStruct);

    expect(mockDoc.text).not.toHaveBeenCalledWith("Versäumnisurteil:");
  });

  it("should add oral negotiation text section if muendlicheVerhandlung is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "yes", mockStruct);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
      expect.any(Number),
    );
  });

  it("should not add oral negotiation text section if muendlicheVerhandlung is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addNegotiationText(mockDoc, "no", "no", "no", mockStruct);
    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
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
      "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gemäß § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt.",
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

  it("should add an empty row between negotiation and default judgment sections", () => {
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
