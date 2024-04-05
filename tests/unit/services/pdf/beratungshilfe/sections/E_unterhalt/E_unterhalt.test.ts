import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
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

jest.mock(
  "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField",
);

const mockedGetListKidsUnterhaltPdfField =
  getListKidsUnterhaltPdfField as jest.Mocked<
    typeof getListKidsUnterhaltPdfField
  >;

const mockedGetListPersonUnterhaltPdfField =
  getListPersonUnterhaltPdfField as jest.Mocked<
    typeof getListPersonUnterhaltPdfField
  >;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("E_unterhalt", () => {
  it("in case does not have data for section_E, the attachment should be not filled", () => {
    (mockedGetListKidsUnterhaltPdfField as jest.Mock).mockReturnValue([]);
    (mockedGetListPersonUnterhaltPdfField as jest.Mock).mockReturnValue([]);

    const context: BeratungshilfeFormularContext = {};
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, context);

    expect(attachment.shouldCreateAttachment).toBe(false);

    const hasAttachmentDescriptionSectionE = attachment.descriptions.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeFalsy();
  });

  it("in case does have data for section_E and the attachment should be filled", () => {
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

    const attachment = createAttachment(context);

    fillUnterhalt(attachment, context);

    expect(attachment.shouldCreateAttachment).toBe(true);

    const hasAttachmentDescriptionSectionE = attachment.descriptions.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeTruthy();
  });
});
