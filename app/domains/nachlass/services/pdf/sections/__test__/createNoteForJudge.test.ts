import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createNoteForJudge } from "../createNoteForJudge";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";

describe("createNoteForJudge", () => {
  it("should not add note for judge section if there is no weitereInformationen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockUserData = {
      weitereInformationen: "",
    } as NachlassErbausschlagungAnfrageUserData;

    createNoteForJudge(mockDoc, mockStruct, mockUserData);

    expect(mockDoc.text).not.toHaveBeenCalled();
  });

  it("should add note for judge section with correct title when there are children", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockUserData = {
      hasKid: "yes",
      weitereInformationen: "Some information for the judge.",
    } as NachlassErbausschlagungAnfrageUserData;

    createNoteForJudge(mockDoc, mockStruct, mockUserData);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "IV. Anmerkungen für das Gericht",
      { align: "left" },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Some information for the judge.",
    );
  });

  it("should add note for judge section with correct title when there are no children", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockUserData = {
      hasKid: "no",
      weitereInformationen: "Some information for the judge.",
    } as NachlassErbausschlagungAnfrageUserData;

    createNoteForJudge(mockDoc, mockStruct, mockUserData);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "III. Anmerkungen für das Gericht",
      { align: "left" },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Some information for the judge.",
    );
  });
});
