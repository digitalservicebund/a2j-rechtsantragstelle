import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { gerbehAmtsgericht } from "~/services/gerichtsfinder/__test__/convertJsonDataTable.test";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { createAttachment } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import fillHeader from "~/services/pdf/beratungshilfe/sections/header";

describe("fillHeader", () => {
  it("should add weiteres einkommen into attachment", async () => {
    const context: BeratungshilfeFormularContext = {
      staatlicheLeistungen: "keine",
      erwerbstaetig: "yes",
      berufart: {
        selbststaendig: CheckboxValue.on,
        festangestellt: CheckboxValue.off,
      },
      weitereseinkommen: happyPathData.weitereseinkommen,
    };

    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillHeader(attachment, pdfFields, context);

    const hasWeiteresEinkommen = attachment.some(
      (description) => description.title === "Weiteres Einkommen",
    );

    expect(hasWeiteresEinkommen).toEqual(true);
  });

  it("should add amtsgericht if available", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(findCourtIfUnique).mockReturnValue({
      ...gerbehAmtsgericht,
      ORT: "Dessau-Roßlau",
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

  it("should not add weiteres einkommen into attachment", async () => {
    const context: BeratungshilfeFormularContext = {
      staatlicheLeistungen: "buergergeld",
      erwerbstaetig: "yes",
      berufart: {
        selbststaendig: CheckboxValue.on,
        festangestellt: CheckboxValue.off,
      },
      weitereseinkommen: happyPathData.weitereseinkommen,
    };

    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillHeader(attachment, pdfFields, context);

    const hasWeiteresEinkommen = attachment.some(
      (description) => description.title === "Weiteres Einkommen:",
    );

    expect(hasWeiteresEinkommen).toEqual(false);
  });

  it("should add marital description in the attachment is bigger than 10 characters", () => {
    const attachment = createAttachment();
    fillHeader(attachment, getBeratungshilfeParameters(), {
      partnerschaft: "yes",
    });
    expect(attachment.length).toBeGreaterThan(0);
  });
});
