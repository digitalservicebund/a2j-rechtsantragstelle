import { faker } from "@faker-js/faker";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { prozesskostenhilfeAntragstellendePersonContext as antragstellendePersonSchema } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  zahlungspflichtigerSchema,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/context";
import { prozesskostenhilfeFinanzielleAngabenEinkuenfteContext as einkuenfteSchema } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { prozesskostenhilfeGrundvoraussetzungen as grundvoraussetzungenSchema } from "~/flows/prozesskostenhilfeFormular/grundvoraussetzungen/context";
import {
  Eigentuemer,
  financialEntrySchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  unterhaltszahlungSchema,
} from "~/flows/shared/finanzielleAngaben/context";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const createFinancialEntry = () => ({
  beschreibung: faker.word.sample(),
  betrag: faker.finance.amount(),
  zahlungsfrequenz: faker.helpers.arrayElement(
    financialEntrySchema.shape.zahlungsfrequenz.options,
  ),
});

export const happyPathData: ProzesskostenhilfeFormularContext = {
  formularArt: grundvoraussetzungenSchema.formularArt.Enum.erstantrag,
  verfahrenArt: grundvoraussetzungenSchema.verfahrenArt.Enum.verfahrenAnwalt,
  versandArt: grundvoraussetzungenSchema.versandArt.Enum.digital,
  empfaenger: antragstellendePersonSchema.empfaenger.Enum.ich,
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
      wert: "unsure",
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
  hasAusgaben: YesNoAnswer.Enum.yes,
  besondereBelastungen: {
    pregnancy: CheckboxValue.on,
    singleParent: CheckboxValue.on,
    disability: CheckboxValue.on,
    medicalReasons: CheckboxValue.on,
  },
  versicherungen: [
    {
      art: prozesskostenhilfeFinanzielleAngabenContext.versicherungen.element
        .shape.art.Enum.sonstige,
      beitrag: faker.finance.amount(),
      sonstigeArt: faker.commerce.productName(),
    },
  ],
  ratenzahlungen: [
    {
      art: faker.commerce.productName(),
      zahlungsempfaenger: faker.company.name(),
      zahlungspflichtiger: zahlungspflichtigerSchema.Enum.myself,
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
      zahlungspflichtiger: zahlungspflichtigerSchema.Enum.myself,
      betragEigenerAnteil: faker.finance.amount(),
      betragGesamt: faker.finance.amount(),
    },
  ],
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
  strasseHausnummer: "Strasse 1",
};
