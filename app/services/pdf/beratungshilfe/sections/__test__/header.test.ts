import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { gerbehAmtsgericht } from "~/services/gerichtsfinder/__test__/convertJsonDataTable.test";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { createAttachment } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import fillHeader from "~/services/pdf/beratungshilfe/sections/header";

describe("fillHeader", () => {
  describe("Adds weiteres einkommen", () => {
    const context: BeratungshilfeFormularContext = {
      staatlicheLeistungen: "keine",
      erwerbstaetig: "yes",
      berufart: {
        selbststaendig: CheckboxValue.on,
        festangestellt: CheckboxValue.off,
      },
      weitereseinkommen: happyPathData.weitereseinkommen,
    };

    const weiteresEinkommenHeading = {
      title: "Weiteres Einkommen",
      text: "Sonstiges",
    };

    it("adds attachment entry", () => {
      const attachment = createAttachment();
      fillHeader(attachment, getBeratungshilfeParameters(), context);
      expect(attachment).toContainEqual(weiteresEinkommenHeading);
    });

    it("skips attachment entry if not relevant (eg grundsicherung)", () => {
      const attachment = createAttachment();
      fillHeader(attachment, getBeratungshilfeParameters(), {
        ...context,
        staatlicheLeistungen: "grundsicherung",
      });
      expect(attachment).not.toContainEqual(weiteresEinkommenHeading);
    });
  });

  it("should add amtsgericht if available", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(findCourtIfUnique).mockReturnValue({
      ...gerbehAmtsgericht,
      BEZEICHNUNG: "Amtsgericht Dessau-Roßlau",
    });

    const pdfFields = getBeratungshilfeParameters();
    fillHeader(createAttachment(), pdfFields, { plz: "06844" });
    expect(pdfFields.namedesAmtsgerichts.value).toEqual("Dessau-Roßlau");
  });

  it("shouldn't add amtsgericht if edge case PLZ", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(findCourtIfUnique).mockReturnValue(undefined);

    const pdfFields = getBeratungshilfeParameters();
    fillHeader(createAttachment(), pdfFields, { plz: "10965" });
    expect(pdfFields.namedesAmtsgerichts.value).toBeUndefined();
  });

  it("should add marital description in the attachment is bigger than 10 characters", () => {
    const attachment = createAttachment();
    fillHeader(attachment, getBeratungshilfeParameters(), {
      partnerschaft: "yes",
    });
    expect(attachment.length).toBeGreaterThan(0);
  });
});
