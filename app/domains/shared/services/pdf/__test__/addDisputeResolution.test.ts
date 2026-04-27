import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  addDisputeResolution,
  type DisputeResolution,
} from "../addDisputeResolution";

describe("addDisputeResolution", () => {
  it("should render claim full justified text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDisputeResolution(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die Klage ist vollumfänglich begründet.",
    );
  });

  it("should render dispute resolution title when there is content", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "yes",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Außergerichtliche Streitbeilegung:",
    );
  });

  it("should not render dispute resolution title when there is no content", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "no",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Außergerichtliche Streitbeilegung:",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "yes",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "no",
      streitbeilegungGruende: "yes",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung gemäß § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "no",
      streitbeilegungGruende: "no",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung noSpecification and streitbeilegungGruende no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "no",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird davon ausgegangen, dass eine gütliche Einigung gemäß § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung noSpecification and streitbeilegungGruende noSpecification", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "no",
    } satisfies DisputeResolution;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird davon ausgegangen, dass eine gütliche Einigung gemäß § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.",
    );
  });
});
