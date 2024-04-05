/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import {
  ATTACHMENT_DESCRIPTION_SECTION_E,
  fillUnterhalt,
} from "~/services/pdf/beratungshilfe/sections/E_unterhalt/E_unterhalt";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField";
import type { UnterhaltPdfField } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField";
import { fillPdf } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/fillPdf";

jest.mock(
  "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField",
);

jest.mock("~/services/pdf/beratungshilfe/sections/E_unterhalt/fillPdf");

const mockedGetListKidsUnterhaltPdfField =
  getListKidsUnterhaltPdfField as jest.Mocked<
    typeof getListKidsUnterhaltPdfField
  >;

const mockedGetListPersonUnterhaltPdfField =
  getListPersonUnterhaltPdfField as jest.Mocked<
    typeof getListPersonUnterhaltPdfField
  >;

const mockedFillPdf = fillPdf as jest.Mocked<typeof fillPdf>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("E_unterhalt", () => {
  it("in case does not have data for section_E, the attachment should be not filled and fillPdf should not be called", async () => {
    (mockedGetListKidsUnterhaltPdfField as jest.Mock).mockReturnValue([]);
    (mockedGetListPersonUnterhaltPdfField as jest.Mock).mockReturnValue([]);

    const context: BeratungshilfeFormularContext = {};

    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, pdfFields, context);

    expect(mockedFillPdf).not.toHaveBeenCalled();
    expect(attachment.shouldCreateAttachment).toBe(false);

    const hasAttachmentDescriptionSectionE = attachment.descriptions.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeFalsy();
  });

  it("in case does have data for section_E and lower than the max list of the pdf, the attachment should be not filled and fillPdf should be called", async () => {
    const mockUnterhaltPdfField: UnterhaltPdfField = {
      name: "name",
      familienverhaeltnis: "Mein Enkelkind",
      hatEinnahmen: true,
    };

    (mockedGetListKidsUnterhaltPdfField as jest.Mock).mockReturnValue([
      mockUnterhaltPdfField,
      mockUnterhaltPdfField,
    ]);
    (mockedGetListPersonUnterhaltPdfField as jest.Mock).mockReturnValue([
      mockUnterhaltPdfField,
      mockUnterhaltPdfField,
    ]);

    const context: BeratungshilfeFormularContext = {};

    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, pdfFields, context);

    expect(mockedFillPdf).toHaveBeenCalled();
    expect(attachment.shouldCreateAttachment).toBe(false);

    const hasAttachmentDescriptionSectionE = attachment.descriptions.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeFalsy();
  });

  it("in case does have data for section_E and more than the max list of the pdf, the attachment should be filled and fillPdf should be not called", async () => {
    const mockUnterhaltPdfField: UnterhaltPdfField = {
      name: "name",
      familienverhaeltnis: "Mein Enkelkind",
      hatEinnahmen: true,
    };

    (mockedGetListKidsUnterhaltPdfField as jest.Mock).mockReturnValue([
      mockUnterhaltPdfField,
      mockUnterhaltPdfField,
    ]);
    (mockedGetListPersonUnterhaltPdfField as jest.Mock).mockReturnValue([
      mockUnterhaltPdfField,
      mockUnterhaltPdfField,
      mockUnterhaltPdfField,
    ]);

    const context: BeratungshilfeFormularContext = {};

    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, pdfFields, context);

    expect(mockedFillPdf).not.toHaveBeenCalled();
    expect(attachment.shouldCreateAttachment).toBe(true);

    const hasAttachmentDescriptionSectionE = attachment.descriptions.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeTruthy();
  });
});
