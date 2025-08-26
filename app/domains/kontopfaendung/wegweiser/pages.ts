import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  checkedOptional,
  exclusiveCheckboxesSchema,
} from "~/services/validation/checkedCheckbox";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const kontopfaendungWegweiserPages = {
  start: {
    stepId: "start",
  },
  kontopfaendung: {
    stepId: "kontopfaendung",
    pageSchema: {
      hasKontopfaendung: z.enum(["nein", "ja"]),
    },
  },
  ergebnisKeineKontopfaendung: {
    stepId: "ergebnis/keine-kontopfaendung",
  },
  pKonto: {
    stepId: "p-konto",
    pageSchema: {
      hasPKonto: z.enum(["nein", "ja", "nichtAktiv", "nichtEingerichtet"]),
    },
  },
  zwischenseiteUnterhalt: {
    stepId: "zwischenseite-unterhalt",
  },
  pKontoProbleme: {
    stepId: "p-konto-probleme",
  },
  kinder: {
    stepId: "kinder",
    pageSchema: { hasKinder: YesNoAnswer },
  },
  kinderWohnenZusammen: {
    stepId: "kinder-wohnen-zusammen",
    pageSchema: {
      kinderWohnenZusammen: z.enum(["nein", "ja", "teilweise"]),
    },
  },
  kinderUnterhalt: {
    stepId: "kinder-unterhalt",
    pageSchema: { kinderUnterhalt: YesNoAnswer },
  },
  partner: {
    stepId: "partner",
    pageSchema: {
      verheiratet: z.enum(["nein", "ja", "geschieden", "verwitwet"]),
    },
  },
  partnerWohnenZusammen: {
    stepId: "partner-wohnen-zusammen",
    pageSchema: {
      partnerWohnenZusammen: YesNoAnswer,
    },
  },
  partnerUnterhalt: {
    stepId: "partner-unterhalt",
    pageSchema: { partnerUnterhalt: YesNoAnswer },
  },
  zwischenseiteEinkuenfte: {
    stepId: "zwischenseite-einkuenfte",
  },
  arbeit: {
    stepId: "arbeit",
    pageSchema: { hasArbeit: YesNoAnswer },
  },
  arbeitArt: {
    stepId: "arbeit-art",
    pageSchema: {
      arbeitArt: z.object({
        angestellt: checkedOptional,
        selbstaendig: checkedOptional,
      }),
    },
  },
  nachzahlungArbeitgeber: {
    stepId: "nachzahlung-arbeitgeber",
    pageSchema: { nachzahlungArbeitgeber: YesNoAnswer },
  },
  hoeheNachzahlungArbeitgeber: {
    stepId: "hoehe-nachzahlung-arbeitgeber",
    pageSchema: { arbeitgeberNachzahlungHigherThan: YesNoAnswer },
  },
  einmalzahlungArbeitgeber: {
    stepId: "einmalzahlung-arbeitgeber",
    pageSchema: {
      zahlungArbeitgeber: exclusiveCheckboxesSchema([
        "urlaubsgeld",
        "weihnachtsgeld",
        "ueberstundenBezahlt",
        "abfindung",
        "anderes",
        "none",
      ]),
    },
  },
  sozialleistungen: {
    stepId: "sozialleistungen",
    pageSchema: {
      hasSozialleistungen: z.enum([
        "buergergeld",
        "grundsicherungSozialhilfe",
        "asylbewerberleistungen",
        "nein",
      ]),
    },
  },
  sozialleistungNachzahlung: {
    stepId: "sozialleistung-nachzahlung",
    pageSchema: { hasSozialleistungNachzahlung: YesNoAnswer },
  },
  sozialleistungenEinmalzahlung: {
    stepId: "sozialleistungen-einmalzahlung",
    pageSchema: {
      hasSozialleistungenEinmalzahlung: YesNoAnswer,
    },
  },
  sozialleistungNachzahlungHigherThan: {
    stepId: "hoehe-nachzahlung-arbeitgeber",
    pageSchema: { sozialleistungNachzahlungHigherThan: YesNoAnswer },
  },
  pfaendungStrafe: {
    stepId: "pfaendung-strafe",
    pageSchema: {
      pfaendungStrafe: YesNoAnswer,
    },
  },
  pfaendungUnterhalt: {
    stepId: "pfaendung-unterhalt",
    pageSchema: {
      pfaendungUnterhalt: YesNoAnswer,
    },
  },
  pflegegeld: {
    stepId: "pflegegeld",
    pageSchema: {
      hasPflegegeld: YesNoAnswer,
    },
  },
  wohngeld: {
    stepId: "wohngeld",
    pageSchema: {
      hasWohngeld: YesNoAnswer,
    },
  },
  wohngeldEmpfaenger: {
    stepId: "wohngeld-empfaenger",
    pageSchema: {
      wohngeld: z.enum(["selbst", "fremd"]),
    },
  },
  wohngeldNachzahlung: {
    stepId: "wohngeld-nachzahlung",
    pageSchema: { hasWohngeldNachzahlung: YesNoAnswer },
  },
  kindergeld: {
    stepId: "kindergeld",
    pageSchema: {
      hasKindergeld: YesNoAnswer,
    },
  },
  kindergeldNachzahlung: {
    stepId: "kindergeld-nachzahlung",
    pageSchema: {
      hasKindergeldNachzahlung: YesNoAnswer,
    },
  },
  rente: {
    stepId: "rente",
    pageSchema: {
      hasRente: YesNoAnswer,
    },
  },
  ergebnisNaechsteSchritte: {
    stepId: "ergebnis/naechste-schritte",
  },
} as const satisfies PagesConfig;
