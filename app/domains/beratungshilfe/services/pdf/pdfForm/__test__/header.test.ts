import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { happyPathData } from "~/domains/beratungshilfe/services/pdf/__test__/beratungshilfeFormularData";
import { gerbehAmtsgericht } from "~/services/gerichtsfinder/__test__/convertJsonDataTable.test";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillHeader } from "../header";

describe("fillHeader", () => {
  describe("Adds weiteres einkommen", () => {
    const userData: BeratungshilfeFormularUserData = {
      staatlicheLeistungen: "keine",
      erwerbstaetig: "yes",
      berufart: {
        selbststaendig: "on",
        festangestellt: "off",
      },
      weitereseinkommen: happyPathData.weitereseinkommen,
    };

    const weiteresEinkommenHeading = {
      title: "Weiteres Einkommen",
      text: "Sonstiges",
    };

    it("adds attachment entry", () => {
      const { attachment } = pdfFillReducer({
        userData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillHeader],
      });

      expect(attachment).toContainEqual(weiteresEinkommenHeading);
    });

    it("skips attachment entry if not relevant (eg grundsicherung)", () => {
      const { attachment } = pdfFillReducer({
        userData: {
          ...userData,
          staatlicheLeistungen: "grundsicherung",
        },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillHeader],
      });

      expect(attachment).not.toContainEqual(weiteresEinkommenHeading);
    });
  });

  it("should add amtsgericht if available", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(findCourt).mockReturnValue({
      ...gerbehAmtsgericht,
      BEZEICHNUNG: "Amtsgericht Dessau-Roßlau",
    });

    const { pdfValues } = pdfFillReducer({
      userData: { plz: "06844" },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillHeader],
    });

    expect(pdfValues.namedesAmtsgerichts.value).toEqual("Dessau-Roßlau");
  });

  it("shouldn't add amtsgericht if edge case PLZ", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(findCourt).mockReturnValue(undefined);

    const { pdfValues } = pdfFillReducer({
      userData: { plz: "10965" },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillHeader],
    });

    expect(pdfValues.namedesAmtsgerichts.value).toBeUndefined();
  });

  it("should add marital description in the attachment is bigger than 10 characters", () => {
    const { attachment } = pdfFillReducer({
      userData: {
        partnerschaft: "yes",
      },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillHeader],
    });

    expect(attachment.length).toBeGreaterThan(0);
  });
});
