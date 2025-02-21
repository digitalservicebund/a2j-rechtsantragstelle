import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const errorMap = () => ({ message: `Bitte treffen Sie eine Auswahl.` });

export const kontopfaendungType = z.enum(["nein", "ja", "weissNicht"], {
  errorMap,
});

export const pKontoType = z.enum(["nein", "ja", "nichtAktiv", "bank"], {
  errorMap,
});

export const schuldenBeiType = z.enum(
  [
    "privat",
    "behoerden",
    "kredit",
    "krankenkasse",
    "rechnung",
    "beitragsservice",
    "unterhalt",
    "strafe",
    "finanzamt",
    "hauptzollamt",
    "nichtSagen",
    "weissNicht",
  ],
  { errorMap },
);

export const euroSchwelleType = z.enum(
  ["nein", "ja", "weissNicht", "unterschiedlich"],
  { errorMap },
);

export const verheiratetType = z.enum(
  ["nein", "ja", "getrennt", "geschieden", "verwitwet"],
  { errorMap },
);

export const kinderLebtMitType = z.enum(["nein", "ja", "weissNicht"], {
  errorMap,
});

export const arbeitsweiseType = z.enum(
  ["arbeitsweise.angestellt", "arbeitsweise.selbstaendig"],
  {
    errorMap,
  },
);

export const paymentArbeitgeberType = z.enum(
  [
    "urlaubsgeld",
    "weihnachtsgeld",
    "ueberstundenBezahlt",
    "abfindung",
    "anderes",
    "no",
  ],
  {
    errorMap,
  },
);

export const context = {
  hasKontopfaendung: kontopfaendungType,
  hasPKonto: pKontoType,
  schuldenBei: schuldenBeiType,
  euroSchwelle: euroSchwelleType,
  hasKinder: YesNoAnswer,
  kinderLebtMit: kinderLebtMitType,
  verheiratet: verheiratetType,
  kindSupport: YesNoAnswer,
  partnerWohnenZusammen: YesNoAnswer,
  partnerSupport: YesNoAnswer,
  hasArbeit: YesNoAnswer,
  arbeitsweise: arbeitsweiseType,
  nachzahlungArbeitgeber: YesNoAnswer,
  amountHigherThan: YesNoAnswer,
  paymentArbeitgeber: paymentArbeitgeberType,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
