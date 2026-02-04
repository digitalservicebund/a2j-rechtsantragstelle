import times from "lodash/times";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { familyRelationshipMap } from "~/domains/shared/services/pdf/unterhaltHelpers";
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

  it("should fill out Section D when the total number of support recipients is under 5", () => {
    const userData = {
      unterhalt: "yes",
      partnerUnterhaltsSumme: "100",
      partnerVorname: "Max",
      partnerNachname: "Mustermann",
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: { day: "01", month: "01", year: "2010" },
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
        },
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: { day: "01", month: "01", year: "2010" },
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
          unterhaltsSumme: "100",
        },
      ],
      unterhaltszahlungen: [
        {
          familyRelationship: "grandchild",
          firstName: "firstName",
          surname: "surname",
          birthday: { day: "10", month: "10", year: "2000" },
          monthlyPayment: "100",
        },
      ],
    } satisfies ProzesskostenhilfeFormularUserData;
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getProzesskostenhilfeParameters(),
      fillFunctions: [fillUnterhaltAngehoerige],
    });
    expect(attachment.length).toBe(0);

    // Partner
    expect(pdfValues.angehoerigerNr1.value).toEqual(
      `${userData.partnerVorname} ${userData.partnerNachname}`,
    );
    expect(pdfValues.verhaeltnis1.value).toEqual("Ehepartner");
    expect(pdfValues.monatsbetrag1.value).toEqual(
      userData.partnerUnterhaltsSumme + " €",
    );
    expect(pdfValues.d1.value).toEqual(true);

    // Child 1
    expect(pdfValues.angehoerigerNr2.value).toEqual(
      `${userData.kinder[0].vorname} ${userData.kinder[0].nachname}`,
    );
    expect(pdfValues.geburtsdatum2.value).toEqual(
      `${userData.kinder[0].geburtsdatum.day}.` +
        `${userData.kinder[0].geburtsdatum.month}.` +
        `${userData.kinder[0].geburtsdatum.year}`,
    );
    expect(pdfValues.verhaeltnis2.value).toEqual("Kind");
    expect(pdfValues.d4.value).toEqual(true);
    expect(pdfValues.betrag2.value).toEqual(
      userData.kinder[0].einnahmen + " €",
    );

    // Child 2
    expect(pdfValues.angehoerigerNr3.value).toEqual(
      `${userData.kinder[1].vorname} ${userData.kinder[0].nachname}`,
    );
    expect(pdfValues.geburtsdatum3.value).toEqual(
      `${userData.kinder[1].geburtsdatum.day}.` +
        `${userData.kinder[1].geburtsdatum.month}.` +
        `${userData.kinder[1].geburtsdatum.year}`,
    );
    expect(pdfValues.verhaeltnis3.value).toEqual("Kind");
    expect(pdfValues.monatsbetrag3.value).toEqual(
      userData.kinder[1].unterhaltsSumme + " €",
    );

    // Other recipient
    expect(pdfValues.angehoerigerNr4.value).toEqual(
      `${userData.unterhaltszahlungen[0].firstName} ${userData.unterhaltszahlungen[0].surname}`,
    );
    expect(pdfValues.geburtsdatum4.value).toEqual(
      `${userData.unterhaltszahlungen[0].birthday.day}.` +
        `${userData.unterhaltszahlungen[0].birthday.month}.` +
        `${userData.unterhaltszahlungen[0].birthday.year}`,
    );
    expect(pdfValues.verhaeltnis4.value).toEqual(
      familyRelationshipMap[userData.unterhaltszahlungen[0].familyRelationship],
    );
    expect(pdfValues.monatsbetrag4.value).toEqual(
      userData.unterhaltszahlungen[0].monthlyPayment + " €",
    );
    expect(pdfValues.d7.value).toEqual(true);
  });

  it("should move the support recipients to the attachment if the total number of support recipients is over 5", () => {
    const userData = {
      kinder: times(6, () => ({
        vorname: "Max",
        nachname: "Mustermann",
        geburtsdatum: { day: "01", month: "01", year: "2010" },
        wohnortBeiAntragsteller: "no",
        unterhaltsSumme: "100",
        unterhalt: "yes",
      })),
    } satisfies ProzesskostenhilfeFormularUserData;
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getProzesskostenhilfeParameters(),
      fillFunctions: [fillUnterhaltAngehoerige],
    });
    expect(attachment.length).toBeGreaterThan(0);
    expect(pdfValues.angehoerigerNr1.value).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
  });
});
