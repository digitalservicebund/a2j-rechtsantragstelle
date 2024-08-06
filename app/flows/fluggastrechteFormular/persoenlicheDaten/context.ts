import { z } from "zod";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";

export const fluggastrechtePersoenlichDaten = {
  forderungMehrerePersonen: YesNoAnswer,
  ...namePrivatPerson,
  ...adresse,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
  unter18JahreAlt: checkedRequired,
  vornameVertretung: stringRequiredSchema,
  nachnameVertretung: stringRequiredSchema,
  beschreibenVertretung: stringRequiredSchema,
  isProzessbevollmaechtigte: YesNoAnswer,
  vornameVollmaechtigte: stringRequiredSchema,
  vollmaechtigteNachname: stringRequiredSchema,
};

const contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof contextObject>;
