import times from "lodash/times";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { familyRelationshipMap } from "~/domains/shared/services/pdf/unterhaltHelpers";
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

  it("should fill out Section E when the total number of support recipients is under 4", () => {
    const userData = {
      unterhalt: "yes",
      partnerUnterhaltsSumme: "100",
      partnerEinkommen: "yes",
      partnerEinkommenSumme: "200",
      partnerVorname: "Max",
      partnerNachname: "Mustermann",
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
      unterhaltszahlungen: [
        {
          familyRelationship: "grandchild",
          firstName: "firstName",
          surname: "surname",
          birthday: "10.10.2000",
          monthlyPayment: "100",
        },
      ],
    } satisfies BeratungshilfeFormularUserData;
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillUnterhalt],
    });

    // Partner
    expect(pdfValues.e1Person1.value).toEqual(
      `${userData.partnerVorname} ${userData.partnerNachname}`,
    );
    expect(pdfValues.e3Familienverhaeltnis.value).toEqual("Ehepartner");
    expect(pdfValues.e4Zahlung1.value).toEqual(
      userData.partnerUnterhaltsSumme + " €",
    );
    expect(pdfValues.e6Betrag1.value).toEqual(
      userData.partnerEinkommenSumme + " €",
    );

    // Child
    const child = userData.kinder[0];
    expect(pdfValues.e1Person2.value).toEqual(
      `${child.vorname} ${child.nachname}`,
    );
    expect(pdfValues.e2Geburtsdatum2.value).toEqual(child.geburtsdatum);
    expect(pdfValues.e3Familienverhaeltnis2.value).toEqual("Kind");
    expect(pdfValues.e4Zahlung2.value).toEqual(child.unterhaltsSumme + " €");
    expect(pdfValues.e6Betrag2.value).toEqual(child.einnahmen + " €");

    // Other recipient
    const other = userData.unterhaltszahlungen[0];
    expect(pdfValues.e1Person3.value).toEqual(
      `${other.firstName} ${other.surname}`,
    );
    expect(pdfValues.e2Geburtsdatum3.value).toEqual(other.birthday);
    expect(pdfValues.e3Familienverhaeltnis3.value).toEqual(
      familyRelationshipMap[other.familyRelationship],
    );
    expect(pdfValues.e5Einnahmen3.value).toEqual(true);
  });

  it("should move the support recipients to the attachment if the total number of support recipients is over 5", () => {
    const userData = {
      kinder: times(6, () => ({
        vorname: "Max",
        nachname: "Mustermann",
      })),
    } satisfies BeratungshilfeFormularUserData;
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillUnterhalt],
    });
    expect(attachment.length).toBeGreaterThan(0);
    expect(pdfValues.e1Person1.value).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
  });
});
