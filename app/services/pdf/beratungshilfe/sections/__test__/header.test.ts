import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  gerbehAmtsgericht,
  plzOrtkEntry,
  plzStrnEntry,
} from "~/services/gerichtsfinder/__test__/convertJsonDataTable.test";
import {
  findCourt,
  edgeCasesForPlz,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import fillHeader, {
  getMaritalDescriptionByContext,
} from "~/services/pdf/beratungshilfe/sections/header";

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
    const attachment = createAttachment(context);

    fillHeader(attachment, pdfFields, context);

    const hasWeiteresEinkommen = attachment.descriptions.some(
      (description) => description.title === "Weiteres Einkommen:",
    );

    expect(hasWeiteresEinkommen).toEqual(true);
  });

  it("should add amtsgericht if available", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(edgeCasesForPlz).mockReturnValue([]);
    vi.mocked(findCourt).mockReturnValue({
      ...gerbehAmtsgericht,
      ORT: "Dessau-Roßlau",
    });

    const pdfFields = getBeratungshilfeParameters();
    fillHeader(createAttachment({}), pdfFields, { plz: "06844" });
    expect(pdfFields.namedesAmtsgerichts.value).toEqual("Dessau-Roßlau");
  });

  it("shouldn't add amtsgericht if edge case PLZ", () => {
    vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");
    vi.mocked(edgeCasesForPlz).mockReturnValue([plzStrnEntry, plzStrnEntry]);
    vi.mocked(findCourt).mockReturnValue({
      ...gerbehAmtsgericht,
      ORT: "Dessau-Roßlau",
    });

    const pdfFields = getBeratungshilfeParameters();
    fillHeader(createAttachment({}), pdfFields, { plz: "10965" });
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
    const attachment = createAttachment(context);

    fillHeader(attachment, pdfFields, context);

    const hasWeiteresEinkommen = attachment.descriptions.some(
      (description) => description.title === "Weiteres Einkommen:",
    );

    expect(hasWeiteresEinkommen).toEqual(false);
  });
});

describe("getMaritalDescriptionByContext", () => {
  it("should return `verheiratet/ in eingetragener Lebenspartnerschaft` when partnerschaft is `yes`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expected = "verheiratet/ in eingetragener Lebenspartnerschaft";

    expect(expected).toBe(actual);
  });
  it("should return `ledig` when partnerschaft is `no`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expected = "ledig";

    expect(expected).toBe(actual);
  });

  it("should return `verwitwet` when partnerschaft is `widowed`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "widowed",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expected = "verwitwet";

    expect(expected).toBe(actual);
  });

  it("should return `getrennt` when partnerschaft is `separated`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "separated",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expected = "getrennt";

    expect(expected).toBe(actual);
  });

  it("should return `` when partnerschaft is `undefined`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: undefined,
    };

    const actual = getMaritalDescriptionByContext(context);
    const expected = "";

    expect(expected).toBe(actual);
  });
});
