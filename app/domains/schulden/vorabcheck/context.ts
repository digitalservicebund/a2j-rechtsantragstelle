import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const schuldenBei = z.enum([
  "privatpersonen",
  "behoerden",
  "sparkasseNichtZurueckzahlen",
  "gesetzlichenKrankenkasse",
  "rechnungenNichtBezahlen",
  "beitragsserviceGEZ",
  "unterhaltsschulden",
  "strafeNichtZahlen",
  "finanzamt",
  "hauptzollamt",
  "nichtSagen",
  "weissNicht",
]);

export const context = {
  hasKontopfaendung: YesNoAnswer,
  hasPKonto: YesNoAnswer,
  schuldenBei: schuldenBei,
  euroSchwelle: YesNoAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
