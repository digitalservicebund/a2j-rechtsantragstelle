import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageKind } from "../createChildrenOfRenunciantPerson";
import { addChildOfRenunciantPersonCustodyDetails } from "../addChildOfRenunciantPersonCustodyDetails";

describe("addChildOfRenunciantPersonCustodyDetails", () => {
  it("should add custody details for another organization", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "anotherOrganization",
      organizationNameSorgerecht: "Sorgerechtsorganisation",
      organizationStrasseSorgerecht: "Sorgerechtsstraße",
      organizationHausnummerSorgerecht: "1",
      organizationPlzSorgerecht: "12345",
      organizationOrtSorgerecht: "Sorgerechtsstadt",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Sorgerecht liegt bei einer Organisation",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Name der Organisation mit dem Sorgerecht: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerechtsorganisation");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Anschrift der Organisation mit dem Sorgerecht:",
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerechtsstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Sorgerechtsstadt");
  });

  it("should add custody details for shared custody with another person", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "shared",
      hasSorgerechtSameAddress: "no",
      vornameSorgerecht: "Max",
      nachnameSorgerecht: "Mustermann",
      strasseSorgerecht: "Musterstraße",
      hausnummerSorgerecht: "1",
      plzSorgerecht: "12345",
      ortSorgerecht: "Musterstadt",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Ausschlagende Person teilt sich das Sorgerecht mit einer anderen Person",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Name der weiteren sorgeberechtigten Person: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Anschrift der weiteren sorgeberechtigten Person: ",
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
  });

  it("should add custody details for shared custody with another person and same address", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "shared",
      hasSorgerechtSameAddress: "yes",
      vornameSorgerecht: "Max",
      nachnameSorgerecht: "Mustermann",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Ausschlagende Person teilt sich das Sorgerecht mit einer anderen Person",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Name der weiteren sorgeberechtigten Person: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Anschrift der weiteren sorgeberechtigten Person: ",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Wohnt zusammen mit der ausschlagenden Person",
    );
  });

  it("should add custody details for shared custody with an other person and same address", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "anotherPerson",
      hasSorgerechtSameAddress: "yes",
      vornameSorgerecht: "Max",
      nachnameSorgerecht: "Mustermann",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Sorgerecht liegt bei einer anderen Person",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Name der sorgeberechtigten Person: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Anschrift der sorgeberechtigten Person: ",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Wohnt zusammen mit der ausschlagenden Person",
    );
  });

  it("should add custody details for shared custody with an other person and different address", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "anotherPerson",
      hasSorgerechtSameAddress: "no",
      vornameSorgerecht: "Max",
      nachnameSorgerecht: "Mustermann",
      strasseSorgerecht: "Musterstraße",
      hausnummerSorgerecht: "1",
      plzSorgerecht: "12345",
      ortSorgerecht: "Musterstadt",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Sorgerecht liegt bei einer anderen Person",
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Name der sorgeberechtigten Person: ",
      {
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Anschrift der sorgeberechtigten Person: ",
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
  });

  it("should not add custody details if optionSorgerecht is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonCustodyDetails(mockDoc, mockStruct, {
      optionSorgerecht: "yes",
    } satisfies NachlassErbausschlagungAnfrageKind);

    expect(mockDoc.text).toHaveBeenCalledWith("Sorgerecht: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Ausschlagende Person ist allein sorgeberechtigt",
    );
  });
});
