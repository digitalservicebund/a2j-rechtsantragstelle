import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addDisputeResolution } from "../addDisputeResolution";

describe("addDisputeResolution", () => {
  it("should render document with assumed settlement section text given streitbeilegung yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "yes",
    } satisfies GeldEinklagenFormularUserData;

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
    } satisfies GeldEinklagenFormularUserData;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung no and streitbeilegungGruende no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "no",
      streitbeilegungGruende: "no",
    } satisfies GeldEinklagenFormularUserData;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung noSpecification and streitbeilegungGruende yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "yes",
    } satisfies GeldEinklagenFormularUserData;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung noSpecification and streitbeilegungGruende no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "no",
    } satisfies GeldEinklagenFormularUserData;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.",
    );
  });

  it("should render document with assumed settlement section text given streitbeilegung noSpecification and streitbeilegungGruende noSpecification", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const mockDataStreitbeilegung = {
      streitbeilegung: "noSpecification",
      streitbeilegungGruende: "no",
    } satisfies GeldEinklagenFormularUserData;

    addDisputeResolution(mockDoc, mockStruct, mockDataStreitbeilegung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.",
    );
  });
});
