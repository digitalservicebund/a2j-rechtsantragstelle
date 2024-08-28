import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import {
  arbeitsArtSchema,
  arbeitsWegSchema,
  staatlicheLeistungenPKHSchema,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { abgabeContext } from "~/flows/shared/abgabe/context";
import {
  Eigentuemer,
  eigentumTotalWorthSchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungSchema,
} from "~/flows/shared/finanzielleAngaben/context";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const happyPathData: ProzesskostenhilfeFormularContext = {
  hasBankkonto: YesNoAnswer.Enum.yes,
  hasGeldanlage: YesNoAnswer.Enum.yes,
  hasWertsache: YesNoAnswer.Enum.yes,
  hasGrundeigentum: YesNoAnswer.Enum.yes,
  hasKraftfahrzeug: YesNoAnswer.Enum.yes,
  eigentumTotalWorth: eigentumTotalWorthSchema.Enum.unsure,
  staatlicheLeistungenPKH: staatlicheLeistungenPKHSchema.Enum.keine,
  currentlyEmployed: YesNoAnswer.Enum.yes,
  employmentType: arbeitsArtSchema.Enum.employed,
  nettoEinkuenfteAlsArbeitnehmer: faker.finance.amount(),
  arbeitsWeg: arbeitsWegSchema.Enum.none,
  hasArbeitsausgaben: YesNoAnswer.Enum.no,
  partnerschaft: YesNoAnswer.Enum.yes,
  zusammenleben: YesNoAnswer.Enum.yes,
  partnerEinkommen: YesNoAnswer.Enum.yes,
  partnerEinkommenSumme: faker.finance.amount(),
  hasKinder: YesNoAnswer.Enum.yes,
  hasWeitereUnterhaltszahlungen: YesNoAnswer.Enum.yes,
  bankkonten: [
    {
      kontoEigentuemer: Eigentuemer.Enum.myself,
      bankName: faker.finance.accountName(),
      kontostand: faker.finance.amount(),
      iban: faker.finance.iban(),
      kontoDescription: faker.lorem.sentence(),
    },
  ],
  geldanlagen: [
    {
      art: gelanlagenArraySchema.element.shape.art.Enum.sonstiges,
      verwendungszweck: faker.lorem.sentence(),
      eigentuemer: Eigentuemer.Enum.myself,
      wert: faker.finance.amount(),
    },
  ],
  wertsachen: [
    {
      art: faker.commerce.productName(),
      eigentuemer: Eigentuemer.Enum.myself,
      wert: faker.finance.amount(),
    },
  ],
  kraftfahrzeuge: [
    {
      hasArbeitsweg: YesNoAnswer.Enum.yes,
      wert: kraftfahrzeugeArraySchema.element.shape.wert.Enum.unsure,
      eigentuemer: Eigentuemer.Enum.partner,
      art: faker.vehicle.vehicle(),
      marke: faker.vehicle.manufacturer(),
      kilometerstand: faker.number.int(),
      baujahr: faker.date.past().getFullYear(),
      anschaffungsjahr: faker.date.past().getFullYear(),
      verkaufswert: faker.finance.amount(),
      bemerkung: faker.lorem.sentence(),
    },
  ],
  grundeigentum: [
    {
      isBewohnt: grundeigentumArraySchema.element.shape.isBewohnt.Enum.yes,
      art: grundeigentumArraySchema.element.shape.art.Enum.einfamilienhaus,
      eigentuemer: Eigentuemer.Enum.myselfAndSomeoneElse,
      flaeche: faker.number.int().toString(),
      verkaufswert: faker.finance.amount(),
      strassehausnummer: faker.location.streetAddress(),
      ort: faker.location.city(),
      land: faker.location.country(),
    },
  ],
  kinder: [
    {
      vorname: faker.person.firstName(),
      nachname: faker.person.lastName(),
      geburtsdatum: faker.date.past().toString(),
      wohnortBeiAntragsteller: YesNoAnswer.Enum.yes,
      eigeneEinnahmen: YesNoAnswer.Enum.yes,
      einnahmen: faker.finance.amount(),
      unterhalt: YesNoAnswer.Enum.yes,
      unterhaltsSumme: faker.finance.amount(),
    },
  ],
  unterhaltszahlungen: [
    {
      familyRelationship:
        unterhaltszahlungSchema.shape.familyRelationship.Enum.mother,
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      birthday: faker.date.past().toString(),
      monthlyPayment: faker.finance.amount(),
    },
  ],
  abgabeArt: abgabeContext.abgabeArt.Enum.ausdrucken,
};
