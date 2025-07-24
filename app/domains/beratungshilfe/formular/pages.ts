import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { kinderSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

export const beratungshilfeAntragPages = {
  start: {
    stepId: "start",
  },
  antragStart: {
    stepId: "#antragStart",
  },
  grundvoraussetzungen: {
    stepId: "grundvoraussetzungen",
  },
  rechtsschutzversicherung: {
    stepId: "rechtsschutzversicherung",
    pageSchema: {
      rechtsschutzversicherung: YesNoAnswer,
    },
  },
  rechtsschutzversicherungHinweis: {
    stepId: "rechtsschutzversicherung-hinweis",
  },
  wurdeVerklagt: {
    stepId: "wurde-verklagt",
    pageSchema: {
      wurdeVerklagt: YesNoAnswer,
    },
  },
  wurdeVerklagtHinweis: {
    stepId: "wurde-verklagt-hinweis",
  },
  klageEingereicht: {
    stepId: "klage-eingereicht",
    pageSchema: {
      klageEingereicht: YesNoAnswer,
    },
  },
  klageEingereichtHinweis: {
    stepId: "klage-eingereicht-hinweis",
  },
  hamburgOderBremen: {
    stepId: "hamburg-oder-bremen",
    pageSchema: {
      hamburgOderBremen: YesNoAnswer,
    },
  },
  hamburgOderBremenHinweis: {
    stepId: "hamburg-oder-bremen-hinweis",
  },
  beratungshilfeBeantragt: {
    stepId: "beratungshilfe-beantragt",
    pageSchema: {
      beratungshilfeBeantragt: YesNoAnswer,
    },
  },
  beratungshilfeBeantragtHinweis: {
    stepId: "beratungshilfe-beantragt-hinweis",
  },
  eigeninitiativeGrundvorraussetzung: {
    stepId: "eigeninitiative-grundvorraussetzung",
  },
  eigeninitiativeGrundvorraussetzungHinweis: {
    stepId: "eigeninitiative-grundvorraussetzung-hinweis",
  },
  anwaltlicheVertretung: {
    stepId: "anwaltliche-vertretung",
  },
  anwaltlicheVertretungStart: {
    stepId: "#anwaltliche-vertretung.start",
  },
  anwaltskanzlei: {
    stepId: "anwaltskanzlei",
    pageSchema: {
      anwaltskanzlei: YesNoAnswer,
    },
  },
  beratungStattgefunden: {
    stepId: "beratung-stattgefunden",
    pageSchema: {
      anwaltskanzlei: YesNoAnswer,
    },
  },
  beratungStattgefundenDatum: {
    stepId: "beratung-stattgefunden-datum",
    pageSchema: {
      beratungStattgefundenDatum: createDateSchema(),
    },
  },
  anwaltName: {
    stepId: "anwalt-name",
    pageSchema: {
      anwaltName: stringRequiredSchema,
    },
  },
  anwaltStrasseUndHausnummer: {
    stepId: "anwalt-strasse-und-hausnummer",
    pageSchema: {
      anwaltStrasseUndHausnummer: stringRequiredSchema,
    },
  },
  anwaltPlz: {
    stepId: "anwalt-plz",
    pageSchema: {
      anwaltPlz: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  anwaltOrt: {
    stepId: "anwalt-ort",
    pageSchema: {
      anwaltOrt: stringRequiredSchema,
    },
  },
  fristHinweis: {
    stepId: "frist-hinweis",
  },
  anwaltKontakdaten: {
    stepId: "anwalt-kontaktdaten",
  },
  anwaltEnde: {
    stepId: "anwalt-ende",
  },
  rechtsproblem: {
    stepId: "rechtsproblem",
  },
  rechtsproblemStart: {
    stepId: "#rechtsproblem.start",
  },
  bereich: {
    stepId: "bereich",
  },
  situationBeschreibung: {
    stepId: "situation-beschreibung",
  },
  finanzielleAngaben: {
    stepId: "finanzielle-angaben",
  },
  einkommen: {
    stepId: "einkommen",
    pageSchema: {
      einkommen: buildMoneyValidationSchema(),
    },
  },
  staatlicheLeistungen: {
    stepId: "staatliche-leistungen",
    pageSchema: {
      staatlicheLeistungen: z.enum(
        ["grundsicherung", "asylbewerberleistungen", "buergergeld", "keine"],
        customRequiredErrorMessage,
      ),
    },
  },
  erwerbstaetig: {
    stepId: "erwerbstaetig",
    pageSchema: {
      erwerbstaetig: YesNoAnswer,
    },
  },
  art: {
    stepId: "art",
    pageSchema: {
      berufart: z.object({
        selbststaendig: checkedOptional,
        festangestellt: checkedOptional,
      }),
    },
  },
  situation: {
    stepId: "situation",
  },
  weiteresEinkommen: {
    stepId: "weiteres-einkommen",
    pageSchema: {
      weiteresEinkommen: z.object({
        unterhaltszahlungen: checkedOptional,
        arbeitlosengeld: checkedOptional,
        wohngeld: checkedOptional,
        kindergeld: checkedOptional,
        bafoeg: checkedOptional,
        krankengeld: checkedOptional,
        rente: checkedOptional,
        elterngeld: checkedOptional,
        insolvenzgeld: checkedOptional,
        ueberbrueckungsgeld: checkedOptional,
        others: checkedOptional,
      }),
    },
  },
  partner: {
    stepId: "partner",
  },
  partnerschaft: {
    stepId: "partnerschaft",
  },
  zusammenleben: {
    stepId: "zusammenleben",
  },
  unterhalt: {
    stepId: "unterhalt",
  },
  keineRolle: {
    stepId: "keine-rolle",
  },
  unterhaltsSumme: {
    stepId: "unterhalts-summe",
  },
  partnerName: {
    stepId: "partner-name",
  },
  partnerEinkommen: {
    stepId: "partner-einkommen",
  },
  partnerEinkommenSumme: {
    stepId: "partner-einkommen-summe",
  },
  kinderArray: {
    stepId: "kinder",
    pageSchema: {
      kinder: z.array(kinderSchema),
    },
  },
  kinderArrayFrage: {
    stepId: "kinder-frage",
  },
  kinderArrayUebersicht: {
    stepId: "uebersicht",
  },
  kinderArrayWarnung: {
    stepId: "warnung",
  },
  kinder: {
    stepId: "kinder",
  },
  kinderName: {
    stepId: "name",
  },
  kinderWohnort: {
    stepId: "wohnort",
  },
  kindEigeneEinnahmenFrage: {
    stepId: "kind-eigene-einnahmen-frage",
  },
  kindEigeneEinnahmen: {
    stepId: "kind-eigene-einnahmen",
  },
  kindUnterhaltFrage: {
    stepId: "kind-unterhalt-frage",
  },
  kindUnterhalt: {
    stepId: "kind-unterhalt",
  },
  kindUnterhaltEnde: {
    stepId: "kind-unterhalt-ende",
  },
  andereUnterhaltszahlungen: {
    stepId: "andere-unterhaltszahlungen",
  },
  andereUnterhaltszahlungenFrage: {
    stepId: "frage",
  },
  andereUnterhaltszahlungenUebersicht: {
    stepId: "uebersicht",
  },
  andereUnterhaltszahlungenWarnung: {
    stepId: "warnung",
  },
  andereUnterhaltszahlungenPerson: {
    stepId: "person",
  },
  andereUnterhaltszahlungenPersonDaten: {
    stepId: "daten",
  },
  wohnung: {
    stepId: "wohnung",
  },
  wohnsituation: {
    stepId: "wohnsituation",
  },
  groesse: {
    stepId: "groesse",
  },
  wohnkostenAllein: {
    stepId: "allein",
  },
  personenAnzahl: {
    stepId: "personen-anzahl",
  },
  wohnkostenGeteilt: {
    stepId: "wohnkosten-geteilt",
  },
  eingentum: {
    stepId: "eigentum",
  },
  eigentumInfo: {
    stepId: "eigentum-info",
  },
  heiratInfo: {
    stepId: "heirat-info",
  },
  eingentumBankkontenFrage: {
    stepId: "bankkonten-frage",
  },
  eingentumGeldanlagenFrage: {
    stepId: "geldanlagen-frage",
  },
  eingentumWertgegenstaendeFrage: {
    stepId: "wertgegenstaende-frage",
  },
  eingentumGrundeigentumFrage: {
    stepId: "grundeigentum-frage",
  },
  eingentumKraftfahrzeugeFrage: {
    stepId: "kraftfahrzeuge-frage",
  },
  eingentumGesamtwert: {
    stepId: "gesamtwert",
  },
  eigentumZusammenfassung: {
    stepId: "eigentum-zusammenfassung",
  },
  zusammenfassung: {
    stepId: "zusammenfassung",
  },
  eigentumZusammenfassungWarnung: {
    stepId: "warnung",
  },
  eigentumZusammenfassungBankkonten: {
    stepId: "bankkonten",
  },
  eigentumZusammenfassungKraftfahrzeuge: {
    stepId: "kraftfahrzeuge",
  },
  eigentumZusammenfassungGeldanlagen: {
    stepId: "geldanlagen",
  },
  eigentumZusammenfassungGrundeigentum: {
    stepId: "grundeigentum",
  },
  eigentumZusammenfassungWertgegenstaende: {
    stepId: "wertgegenstaende",
  },
  ausgabenArray: {
    stepId: "ausgaben",
    pageSchema: {
      ausgaben: z.array(
        z
          .object({
            art: stringRequiredSchema,
            zahlungsempfaenger: stringRequiredSchema,
            beitrag: buildMoneyValidationSchema(),
            hasZahlungsfrist: YesNoAnswer,
            zahlungsfrist: createDateSchema({
              earliest: () => today(),
            }),
          })
          .partial(),
      ),
    },
  },
  ausgabenFrage: {
    stepId: "ausgaben-frage",
  },
  ausgabenSituation: {
    stepId: "situation",
    pageSchema: {
      ausgabensituation: z.object({
        pregnancy: checkedOptional,
        singleParent: checkedOptional,
        disability: checkedOptional,
        medicalReasons: checkedOptional,
      }),
    },
  },
  ausgabenUebersicht: {
    stepId: "uebersicht",
  },
  ausgabenWarnung: {
    stepId: "warnung",
  },
  ausgabenPerson: {
    stepId: "person",
  },
  ausgabenPersonDaten: {
    stepId: "daten",
  },
  ausgaben: {
    stepId: "ausgaben",
  },
  ausgabenArt: {
    stepId: "art",
  },
  zahlungsinformation: {
    stepId: "zahlungsinformation",
  },
  laufzeit: {
    stepId: "laufzeit",
  },
  zahlungsfrist: {
    stepId: "zahlungsfrist",
  },
  persoenlicheDaten: {
    stepId: "persoenliche-daten",
  },
  persoenlicheDatenStart: {
    stepId: "start",
  },
  persoenlicheDatenName: {
    stepId: "name",
  },
  persoenlicheDatenGeburtsdatum: {
    stepId: "geburtsdatum",
  },
  persoenlicheDatenPLZ: {
    stepId: "plz",
  },
  persoenlicheDatenAdresse: {
    stepId: "adresse",
  },
  persoenlicheDatenTelefonnummer: {
    stepId: "telefonnummer",
  },
  persoenlichenDatenNachbefragung: {
    stepId: "nachbefragung",
  },
  weitereAngaben: {
    stepId: "weitere-angaben",
  },
  abgabe: {
    stepId: "abgabe",
  },
  abgabeUeberpruefung: {
    stepId: "ueberpruefung",
  },
  abgabeZusammenfassung: {
    stepId: "zusammenfassung",
  },
  abgabeArt: {
    stepId: "art",
  },
  dokumente: {
    stepId: "dokumente",
  },
  ausdrucken: {
    stepId: "ausdrucken",
  },
  online: {
    stepId: "online",
  }
} as const satisfies PagesConfig;
