import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import {
  ATTACHMENT_DESCRIPTION_SECTION_D,
  fillUnterhaltAngehoerige,
} from "../D_angehoerige";

describe("D_angehoerige", () => {
  it("No section D title in attachment without data", () => {
    const { attachment } = pdfFillReducer({
      userData: {},
      pdfParams: getProzesskostenhilfeParameters(),
      fillFunctions: [fillUnterhaltAngehoerige],
    });

    const hasAttachmentDescriptionSectionD = attachment.some(
      (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_D,
    );
    expect(hasAttachmentDescriptionSectionD).toBeFalsy();
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
  } satisfies Record<string, ProzesskostenhilfeFormularUserData>;

  test.each(Object.entries(testContexts))(
    "fills unterhalt into attachment for %s",
    (_, testContext) => {
      const { pdfValues, attachment } = pdfFillReducer({
        userData: testContext,
        pdfParams: getProzesskostenhilfeParameters(),
        fillFunctions: [fillUnterhaltAngehoerige],
      });

      const hasAttachmentDescriptionSectionD = attachment.some(
        (description) => description.title === ATTACHMENT_DESCRIPTION_SECTION_D,
      );
      expect(hasAttachmentDescriptionSectionD).toBeTruthy();
      expect(pdfValues.angehoerigerNummereins.value).toEqual(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
    },
  );
});
