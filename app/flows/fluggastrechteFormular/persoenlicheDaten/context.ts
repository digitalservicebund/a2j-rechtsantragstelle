import { z } from "zod";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { namePrivatPerson, adresse } from "../../persoenlicheDaten/context";

const fluggastrechtePersoenlichVertretungDaten = {
  vornameVertretung: optionalOrSchema(stringRequiredSchema),
  nachnameVertretung: optionalOrSchema(stringRequiredSchema),
  strasseHausnummerVertretung: optionalOrSchema(stringRequiredSchema),
  plzVertretung: stringRequiredSchema.pipe(postcodeSchema).optional(),
  ortVertretung: optionalOrSchema(stringRequiredSchema),
  beschreibenVertretung: optionalOrSchema(stringRequiredSchema),
};

export const fluggastrechtePersoenlichDaten = {
  forderungMehrerePersonen: YesNoAnswer,
  ...namePrivatPerson,
  ...adresse,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
  unter18JahreAlt: checkedOptional,
  ...fluggastrechtePersoenlichVertretungDaten,
  isProzessbevollmaechtigte: YesNoAnswer,
  vornameVollmaechtigte: stringRequiredSchema,
  vollmaechtigteNachname: stringRequiredSchema,
  weiterePersonen: z.array(
    z.object({
      ...namePrivatPerson,
      ...adresse,
      telefonnummer: optionalOrSchema(phoneNumberSchema),
      unter18JahreAlt: checkedOptional,
      ...fluggastrechtePersoenlichVertretungDaten,
    }),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
