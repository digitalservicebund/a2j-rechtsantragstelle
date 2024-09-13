import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  ATTACHMENT_DESCRIPTION_SECTION_E,
  SEE_IN_ATTACHMENT_DESCRIPTION,
  fillUnterhalt,
} from "~/services/pdf/beratungshilfe/sections/E_unterhalt";

describe("E_unterhalt", () => {
  it("No section E title in attachment without data", () => {
    const attachment = createAttachment();
    fillUnterhalt(attachment, getBeratungshilfeParameters(), {});

    const hasAttachmentDescriptionSectionE = attachment.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeFalsy();
  });

  const testContexts = {
    partner: {
      unterhalt: "yes",
      unterhaltsSumme: "100",
    },
    children: {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: "01.01.2010",
          unterhaltsSumme: "100",
          wohnortBeiAntragsteller: "no",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
          unterhalt: "yes",
        },
      ],
    },
    others: {
      unterhaltszahlungen: [
        {
          familyRelationship: "grandchild",
          firstName: "firstName",
          surname: "surname",
          birthday: "10.10.2000",
          monthlyPayment: "100",
        },
      ],
    },
  } satisfies Record<string, BeratungshilfeFormularContext>;

  test.each(Object.entries(testContexts))(
    "fills unterhalt into attachment for %s",
    (_, testContext) => {
      const attachment = createAttachment();
      const pdfFields = getBeratungshilfeParameters();
      fillUnterhalt(attachment, pdfFields, testContext);

      const hasAttachmentDescriptionSectionE = attachment.some(
        (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
      );
      expect(hasAttachmentDescriptionSectionE).toBeTruthy();
      expect(pdfFields.e1Person1.value).toEqual(SEE_IN_ATTACHMENT_DESCRIPTION);
    },
  );
});
