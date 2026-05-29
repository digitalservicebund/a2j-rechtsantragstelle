import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createChildrenOfRenunciantPerson } from "../createChildrenOfRenunciantPerson";
import { addChildOfRenunciantPersonAddress } from "../addChildOfRenunciantPersonAddress";
import { addChildOfRenunciantPersonDetails } from "../addChildOfRenunciantPersonDetails";
import { addChildOfRenunciantPersonCustodyDetails } from "../addChildOfRenunciantPersonCustodyDetails";
import { today } from "~/util/date";

const mockKinder = [
  {
    vorname: "Child 1",
    geburtsdatum: {
      day: "01",
      month: "01",
      year: today().getFullYear().toString(),
    },
  },
  {
    vorname: "Child 2",
    geburtsdatum: { day: "02", month: "02", year: "1900" },
  },
];

vi.mock("../addChildOfRenunciantPersonDetails");
vi.mock("../addChildOfRenunciantPersonAddress");
vi.mock("../addChildOfRenunciantPersonCustodyDetails");

vi.mocked(addChildOfRenunciantPersonDetails).mockImplementation(() => vi.fn());
vi.mocked(addChildOfRenunciantPersonAddress).mockImplementation(() => vi.fn());
vi.mocked(addChildOfRenunciantPersonCustodyDetails).mockImplementation(() =>
  vi.fn(),
);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createChildrenOfRenunciantPerson", () => {
  it("should not add the section if there are no children", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "no",
    });

    expect(mockDoc.struct).not.toHaveBeenCalledWith("Sect");
  });

  it("should not add the section if the kinder array is empty", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: [],
    });

    expect(mockDoc.struct).not.toHaveBeenCalledWith("Sect");
  });

  it("should add the title and subtiles", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: mockKinder,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "III. Kinder der ausschlagenden Person",
    );

    expect(mockDoc.text).toHaveBeenCalledWith("Kind 1");
    expect(mockDoc.text).toHaveBeenCalledWith("Kind 2");
  });

  it("should call addChildOfRenunciantPersonDetails twice", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: mockKinder,
    });

    expect(addChildOfRenunciantPersonDetails).toHaveBeenCalledTimes(2);
  });

  it("should call addChildOfRenunciantPersonAddress twice", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: mockKinder,
    });

    expect(addChildOfRenunciantPersonAddress).toHaveBeenCalledTimes(2);
  });

  it("should call addChildOfRenunciantPersonCustodyDetails once", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: mockKinder,
    });

    expect(addChildOfRenunciantPersonCustodyDetails).toHaveBeenCalledTimes(1);
  });

  it("should call the text if hasRenouncedInheritance is provided", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    const kindWithRenouncedInheritance = {
      vorname: "Child 1",
      geburtsdatum: {
        day: "01",
        month: "01",
        year: today().getFullYear().toString(),
      },
      hasRenouncedInheritance: "yes" as const,
    };

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: [kindWithRenouncedInheritance],
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Das Erbe soll auch für das Kind ausgeschlagen werden: ",
      {
        continued: true,
      },
    );
  });

  it("should not call the text if hasRenouncedInheritance is not provided", () => {
    const documentStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(documentStruct);

    createChildrenOfRenunciantPerson(mockDoc, documentStruct, {
      hasKid: "yes",
      kinder: mockKinder,
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Das Erbe soll auch für das Kind ausgeschlagen werden: ",
    );
  });
});
