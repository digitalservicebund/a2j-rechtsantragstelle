import { faker } from "@faker-js/faker";
import { prozesskostenhilfeAntragstellendePersonInputSchema as antragstellendePersonSchema } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/userData";
import { prozesskostenhilfeFinanzielleAngabenEinkuenfteInputSchema as einkuenfteSchema } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/userData";
import {
  prozesskostenhilfeFinanzielleAngabenInputSchema,
  zahlungspflichtigerInputSchema,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  eigentuemerInputSchema,
  financialEntryInputSchema,
  unterhaltszahlungInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const createFinancialEntry = () => ({
  beschreibung: faker.word.sample(),
  betrag: faker.finance.amount(),
  zahlungsfrequenz: faker.helpers.arrayElement(
    financialEntryInputSchema.shape.zahlungsfrequenz.options,
  ),
});

export const happyPathData: ProzesskostenhilfeFormularUserData = {
  formularArt: "erstantrag",
  verfahrenArt: "verfahrenAnwalt",
  versandArt: "digital",
  empfaenger: antragstellendePersonSchema.empfaenger.Enum.myself,
  unterhaltsanspruch: antragstellendePersonSchema.unterhaltsanspruch.Enum.keine,
  hasBankkonto: YesNoAnswer.Enum.yes,
  hasGeldanlage: YesNoAnswer.Enum.yes,
  hasWertsache: YesNoAnswer.Enum.yes,
  hasGrundeigentum: YesNoAnswer.Enum.yes,
  hasKraftfahrzeug: YesNoAnswer.Enum.yes,
  staatlicheLeistungen: einkuenfteSchema.staatlicheLeistungen.Enum.buergergeld,
  buergergeld: faker.finance.amount(),
  currentlyEmployed: YesNoAnswer.Enum.yes,
  employmentType: einkuenfteSchema.employmentType.Enum.employedAndSelfEmployed,
  nettoEinkuenfteAlsArbeitnehmer: faker.finance.amount(),
  selbststaendigMonatlichesEinkommen: faker.finance.amount(),
  selbststaendigBruttoNetto:
    einkuenfteSchema.selbststaendigBruttoNetto.Enum.brutto,
  selbststaendigAbzuege: faker.finance.amount(),
  arbeitsweg: einkuenfteSchema.arbeitsweg.Enum.publicTransport,
  monatlicheOPNVKosten: faker.finance.amount(),
  arbeitsplatz: {
    strasseHausnummer: faker.location.streetAddress(),
    ort: faker.location.city(),
    plz: faker.location.zipCode("#####"),
  },
  arbeitsplatzEntfernung: faker.number.int({ min: 1, max: 100 }),
  hasArbeitsausgaben: YesNoAnswer.Enum.yes,
  arbeitsausgaben: faker.helpers.multiple(createFinancialEntry),
  receivesPension: YesNoAnswer.Enum.yes,
  pensionAmount: faker.finance.amount(),
  hasWohngeld: checkedOptional.enum.on,
  hasKrankengeld: checkedOptional.enum.on,
  hasElterngeld: checkedOptional.enum.on,
  hasKindergeld: checkedOptional.enum.on,
  wohngeldAmount: faker.finance.amount(),
  krankengeldAmount: faker.finance.amount(),
  elterngeldAmount: faker.finance.amount(),
  kindergeldAmount: faker.finance.amount(),
  hasFurtherIncome: YesNoAnswer.Enum.yes,
  weitereEinkuenfte: faker.helpers.multiple(createFinancialEntry),
  partnerschaft: YesNoAnswer.Enum.yes,
  zusammenleben: YesNoAnswer.Enum.yes,
  partnerEinkommen: YesNoAnswer.Enum.no,
  hasKinder: YesNoAnswer.Enum.yes,
  hasWeitereUnterhaltszahlungen: YesNoAnswer.Enum.yes,
  bankkonten: [
    {
      kontoEigentuemer: eigentuemerInputSchema.Enum.myself,
      bankName: faker.finance.accountName(),
      kontostand: faker.finance.amount(),
      iban: faker.finance.iban(),
      kontoDescription: faker.lorem.sentence(),
    },
  ],
  geldanlagen: [
    {
      art: "sonstiges",
      verwendungszweck: faker.lorem.sentence(),
      eigentuemer: eigentuemerInputSchema.Enum.myself,
      wert: faker.finance.amount(),
    },
  ],
  wertsachen: [
    {
      art: faker.commerce.productName(),
      eigentuemer: eigentuemerInputSchema.Enum.myself,
      wert: faker.finance.amount(),
    },
  ],
  kraftfahrzeuge: [
    {
      hasArbeitsweg: YesNoAnswer.Enum.yes,
      wert: "unsure",
      eigentuemer: eigentuemerInputSchema.Enum.partner,
      art: faker.vehicle.vehicle(),
      marke: faker.vehicle.manufacturer(),
      kilometerstand: faker.number.int(),
      baujahr: faker.date.past().getFullYear(),
      anschaffungsjahr: faker.date.past().getFullYear(),
      verkaufswert: faker.finance.amount(),
    },
  ],
  grundeigentum: [
    {
      isBewohnt: "yes",
      art: "einfamilienhaus",
      eigentuemer: eigentuemerInputSchema.Enum.myselfAndSomeoneElse,
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
        unterhaltszahlungInputSchema.shape.familyRelationship.Enum.mother,
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      birthday: faker.date.past().toString(),
      monthlyPayment: faker.finance.amount(),
    },
  ],
  hasAusgaben: YesNoAnswer.Enum.yes,
  besondereBelastungen: {
    pregnancy: "on",
    singleParent: "on",
    disability: "on",
    medicalReasons: "on",
  },
  versicherungen: [
    {
      art: prozesskostenhilfeFinanzielleAngabenInputSchema.versicherungen
        .element.shape.art.Enum.sonstige,
      beitrag: faker.finance.amount(),
      sonstigeArt: faker.commerce.productName(),
    },
  ],
  ratenzahlungen: [
    {
      art: faker.commerce.productName(),
      zahlungsempfaenger: faker.company.name(),
      zahlungspflichtiger: zahlungspflichtigerInputSchema.Enum.myself,
      betragEigenerAnteil: faker.finance.amount(),
      betragGesamt: faker.finance.amount(),
      restschuld: faker.finance.amount(),
      laufzeitende: faker.date.future().toString(),
    },
  ],
  sonstigeAusgaben: [
    {
      art: faker.commerce.productName(),
      zahlungsempfaenger: faker.company.name(),
      zahlungspflichtiger: zahlungspflichtigerInputSchema.Enum.myself,
      betragEigenerAnteil: faker.finance.amount(),
      betragGesamt: faker.finance.amount(),
    },
  ],
  livingSituation: "alone",
  apartmentSizeSqm: 42,
  numberOfRooms: 2,
  rentsApartment: "yes",
  totalRent: "1000",
  hasRsv: YesNoAnswer.Enum.no,
  hasRsvThroughOrg: YesNoAnswer.Enum.no,
  hasGesetzlicheVertretung: YesNoAnswer.Enum.yes,
  gesetzlicheVertretungDaten: {
    vorname: faker.person.firstName(),
    nachname: faker.person.lastName(),
    strasseHausnummer: faker.location.streetAddress(),
    plz: faker.location.zipCode("12159"),
    ort: faker.location.city(),
    telefonnummer: faker.phone.number(),
  },
  vorname: "John",
  nachname: "Doe",
  beruf: "Developer",
  ort: "Berlin",
  plz: "10119",
  geburtsdatum: "01.01.1981",
  street: "Strasse",
  houseNumber: "1",
  // telefonnummer: "",
};
