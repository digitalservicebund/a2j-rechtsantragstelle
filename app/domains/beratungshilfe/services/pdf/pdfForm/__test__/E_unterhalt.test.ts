import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import {
  ATTACHMENT_DESCRIPTION_SECTION_E,
  fillUnterhalt,
} from "../E_unterhalt";

describe("E_unterhalt", () => {
  it("No section E title in attachment without data", () => {
    const { attachment } = pdfFillReducer({
      userData: {},
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillUnterhalt],
    });

    const hasAttachmentDescriptionSectionE = attachment.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
    );
    expect(hasAttachmentDescriptionSectionE).toBeFalsy();
  });

  const testContexts = {
    partner: {
      unterhalt: "yes",
      partnerUnterhaltsSumme: "100",
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
  } satisfies Record<string, BeratungshilfeFormularUserData>;

  test.each(Object.entries(testContexts))(
    "fills unterhalt into attachment for %s",
    (_, testContext) => {
      const { pdfValues, attachment } = pdfFillReducer({
        userData: testContext,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillUnterhalt],
      });

      const hasAttachmentDescriptionSectionE = attachment.some(
        (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_E,
      );
      expect(hasAttachmentDescriptionSectionE).toBeTruthy();
      expect(pdfValues.e1Person1.value).toEqual(SEE_IN_ATTACHMENT_DESCRIPTION);
    },
  );
});
