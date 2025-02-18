import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const context = {
  hasKontopfaendung: YesNoAnswer,
  hasPKonto: YesNoAnswer,
  schuldenBei: z.enum([
    "privatpersonen",
    "behörden",
    "nicht-zurückzahlen",
    "finanzamt",
    "beitragsservice",
    "unterhaltsschulden",
    "strafe-nicht-zahlen",
    "rechnungen-nicht-bezahlen",
    "glaeubigerin-unbekannt",
  ]),
  euroSchwelle: YesNoAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
