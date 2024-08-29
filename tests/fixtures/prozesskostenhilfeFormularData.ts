import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import {
  arbeitsArtSchema,
  arbeitsWegSchema,
  selbststaendigeBruttoNettoSchema,
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
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const happyPathData: ProzesskostenhilfeFormularContext = {
  hasBankkonto: YesNoAnswer.Enum.yes,
  hasGeldanlage: YesNoAnswer.Enum.yes,
  hasWertsache: YesNoAnswer.Enum.yes,
  hasGrundeigentum: YesNoAnswer.Enum.yes,
  hasKraftfahrzeug: YesNoAnswer.Enum.yes,
  eigentumTotalWorth: eigentumTotalWorthSchema.Enum.unsure,
  staatlicheLeistungenPKH: staatlicheLeistungenPKHSchema.Enum.buergergeld,
  buergergeld: faker.finance.amount({ min: 1 }),
  currentlyEmployed: YesNoAnswer.Enum.yes,
  employmentType: arbeitsArtSchema.Enum.employedAndSelfEmployed,
  nettoEinkuenfteAlsArbeitnehmer: faker.finance.amount({ min: 1 }),
  selbststaendigesMonatlicheEinkommen: faker.finance.amount({ min: 1 }),
  selbststaendigeBruttoNetto: selbststaendigeBruttoNettoSchema.Enum.brutto,
  selbststaendigeAbzuege: faker.finance.amount({ min: 1 }),
  arbeitsWeg: arbeitsWegSchema.Enum.publicTransport,
  monatlicheOPNVKosten: faker.finance.amount({ min: 1 }),
  arbeitsplatz: {
    strasseHausnummer: faker.location.streetAddress(),
    ort: faker.location.city(),
    plz: faker.location.zipCode("#####"),
  },
  arbeitsplatzEntfernung: faker.number.int({ min: 1, max: 100 }),
  hasArbeitsausgaben: YesNoAnswer.Enum.yes,
  arbeitsausgaben: [
    {
      beschreibung: faker.word.sample(),
      betrag: faker.finance.amount({ min: 1 }),
      zahlungsfrequenz: "monthly",
    },
  ],
  receivesPension: YesNoAnswer.Enum.yes,
  pensionAmount: faker.finance.amount({ min: 1 }),
  receivesSupport: YesNoAnswer.Enum.yes,
  supportAmount: faker.finance.amount({ min: 1 }),
  hasWohngeld: checkedOptional.enum.on,
  hasKrankengeld: checkedOptional.enum.on,
  hasElterngeld: checkedOptional.enum.on,
  hasKindergeld: checkedOptional.enum.on,
  wohngeldAmount: faker.finance.amount({ min: 1 }),
  krankengeldAmount: faker.finance.amount({ min: 1 }),
  elterngeldAmount: faker.finance.amount({ min: 1 }),
  kindergeldAmount: faker.finance.amount({ min: 1 }),
  hasFurtherIncome: YesNoAnswer.Enum.yes,
  weitereEinkuenfte: [
    {
      beschreibung: faker.word.sample(),
      betrag: faker.finance.amount({ min: 1 }),
      zahlungsfrequenz: "monthly",
    },
  ],
  partnerschaft: YesNoAnswer.Enum.yes,
  zusammenleben: YesNoAnswer.Enum.yes,
  partnerEinkommen: YesNoAnswer.Enum.yes,
  partnerEinkommenSumme: faker.finance.amount({ min: 1 }),
  hasKinder: YesNoAnswer.Enum.yes,
  hasWeitereUnterhaltszahlungen: YesNoAnswer.Enum.yes,
  bankkonten: [
    {
      kontoEigentuemer: Eigentuemer.Enum.myself,
      bankName: faker.finance.accountName(),
      kontostand: faker.finance.amount({ min: 1 }),
      iban: faker.finance.iban(),
      kontoDescription: faker.lorem.sentence(),
    },
  ],
  geldanlagen: [
    {
      art: gelanlagenArraySchema.element.shape.art.Enum.sonstiges,
      verwendungszweck: faker.lorem.sentence(),
      eigentuemer: Eigentuemer.Enum.myself,
      wert: faker.finance.amount({ min: 1 }),
    },
  ],
  wertsachen: [
    {
      art: faker.commerce.productName(),
      eigentuemer: Eigentuemer.Enum.myself,
      wert: faker.finance.amount({ min: 1 }),
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
      verkaufswert: faker.finance.amount({ min: 1 }),
      bemerkung: faker.lorem.sentence(),
    },
  ],
  grundeigentum: [
    {
      isBewohnt: grundeigentumArraySchema.element.shape.isBewohnt.Enum.yes,
      art: grundeigentumArraySchema.element.shape.art.Enum.einfamilienhaus,
      eigentuemer: Eigentuemer.Enum.myselfAndSomeoneElse,
      flaeche: faker.number.int().toString(),
      verkaufswert: faker.finance.amount({ min: 1 }),
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
      einnahmen: faker.finance.amount({ min: 1 }),
      unterhalt: YesNoAnswer.Enum.yes,
      unterhaltsSumme: faker.finance.amount({ min: 1 }),
    },
  ],
  unterhaltszahlungen: [
    {
      familyRelationship:
        unterhaltszahlungSchema.shape.familyRelationship.Enum.mother,
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      birthday: faker.date.past().toString(),
      monthlyPayment: faker.finance.amount({ min: 1 }),
    },
  ],
  abgabeArt: abgabeContext.abgabeArt.Enum.ausdrucken,
};
