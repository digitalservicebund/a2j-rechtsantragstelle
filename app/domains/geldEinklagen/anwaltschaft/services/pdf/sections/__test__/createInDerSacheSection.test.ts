import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { createInDerSache } from "../createInDerSache";
import { createLocalCourtAndDate } from "~/domains/shared/services/pdf/createLocalCourtAndDate";
import { findCourtByName } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { addKlagende } from "../addKlagende";
import { addKlagendeProzessbevollmaechtigte } from "../addKlagendeProzessbevollmaechtigte";
import { addMissingData } from "../addMissingData";

vi.mock("~/domains/shared/services/pdf/createLocalCourtAndDate");
vi.mock("~/services/gerichtsfinder/amtsgerichtData.server", () => ({
  findCourtByName: vi.fn(),
}));
vi.mock("../addKlagende");
vi.mock("../addKlagendeProzessbevollmaechtigte");
vi.mock("../addMissingData");

describe("createInDerSacheSection", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should print the selected pilot court and render klagende sections", () => {
    vi.mocked(findCourtByName).mockReturnValue({} as never);
    const { doc, documentStruct } = createPdfTestContext();

    createInDerSache(doc, documentStruct, {
      ...emptyUserData,
      pilotgericht: "bonn",
    });

    expect(findCourtByName).toHaveBeenCalledWith("Amtsgericht Bonn");
    expect(createLocalCourtAndDate).toHaveBeenCalledWith(
      doc,
      documentStruct,
      expect.anything(),
    );
    expect(addKlagende).toHaveBeenCalledWith(doc, documentStruct, {
      ...emptyUserData,
      pilotgericht: "bonn",
    });
    expect(addKlagendeProzessbevollmaechtigte).toHaveBeenCalled();
    expect(addMissingData).not.toHaveBeenCalledWith(
      doc,
      documentStruct,
      "Amtsgericht",
    );
    expect(getPrintedText(doc)).toContain("Klage");
  });

  it("should mark the court as missing when no pilot court is selected", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createInDerSache(doc, documentStruct, emptyUserData);

    expect(addMissingData).toHaveBeenCalledWith(
      doc,
      documentStruct,
      "Amtsgericht",
    );
  });
});
