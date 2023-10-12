import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { postcodeSchema } from "~/services/validation/plz";

export const context = {
  titel: z.enum(["Keine Auswahl", "Dr."]),
  nachname: z.string().min(1),
  vorname: z.string().min(1),
  geburtsdatum: z.string().min(1),
  strasse: z.string().min(1),
  plz: postcodeSchema,
  ort: z.string().min(1),
  telefonnummer: z.string().min(1),
  gesetzlicheVertretung: YesNoAnswer,
  bevollmaechtigtePerson: z.enum(["lawyer", "yes", "no"]),
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenFormularContext = z.infer<typeof contextObject>;
