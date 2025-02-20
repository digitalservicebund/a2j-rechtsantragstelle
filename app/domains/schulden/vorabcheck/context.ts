import { z } from "zod";
import {
  YesNoAnswer,
  YesNoMaybeAnswer,
} from "~/services/validation/YesNoAnswer";

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

export const context = {
  hasKontopfaendung: kontopfaendungType,
  hasPKonto: pKontoType,
  schuldenBei: schuldenBeiType,
  euroSchwelle: euroSchwelleType,
  hasKinder: YesNoAnswer,
  kinderLebtMit: YesNoMaybeAnswer,
  verheiratet: verheiratetType,
  kindSupport: YesNoAnswer,
  wohnenZusammen: YesNoAnswer,
  partnerSupport: YesNoAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
