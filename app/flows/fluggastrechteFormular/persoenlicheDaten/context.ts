import { z } from "zod";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";

export const fluggastrechtePersoenlichDaten = {
  forderungMehrerePersonen: YesNoAnswer,
  ...namePrivatPerson,
  ...adresse,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
  unter18JahreAlt: checkedOptional,
  vornameVertretung: stringRequiredSchema,
  nachnameVertretung: stringRequiredSchema,
  strasseHausnummerVertretung: stringRequiredSchema,
  plzVertretung: stringRequiredSchema.pipe(postcodeSchema),
  ortVertretung: stringRequiredSchema,
  beschreibenVertretung: stringRequiredSchema,
  isProzessbevollmaechtigte: YesNoAnswer,
  vornameVollmaechtigte: stringRequiredSchema,
  vollmaechtigteNachname: stringRequiredSchema,
  weiterePersonen: z.array(
    z.object({
      ...namePrivatPerson,
      ...adresse,
      telefonnummer: optionalOrSchema(phoneNumberSchema),
      unter18JahreAlt: checkedOptional,
      vornameVertretung: stringRequiredSchema,
      nachnameVertretung: stringRequiredSchema,
      beschreibenVertretung: stringRequiredSchema,
    }),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
