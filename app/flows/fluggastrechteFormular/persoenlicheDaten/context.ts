import { z } from "zod";
import { adresseSchema } from "~/flows/shared/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { namePrivatPerson } from "../../persoenlicheDaten/context";

const fluggastrechtePersoenlichVertretungDaten = {
  vornameVertretung: optionalOrSchema(stringRequiredSchema),
  nachnameVertretung: optionalOrSchema(stringRequiredSchema),
  strasseHausnummerVertretung: optionalOrSchema(stringRequiredSchema),
  plzVertretung: stringRequiredSchema.pipe(postcodeSchema).optional(),
  ortVertretung: optionalOrSchema(stringRequiredSchema),
  beschreibenVertretung: optionalOrSchema(stringRequiredSchema),
};

export const fluggastrechtePersoenlichDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
  unter18JahreAlt: checkedOptional,
  ...fluggastrechtePersoenlichVertretungDaten,
  isProzessbevollmaechtigte: YesNoAnswer,
  vornameVollmaechtigte: optionalOrSchema(stringRequiredSchema),
  vollmaechtigteNachname: optionalOrSchema(stringRequiredSchema),
  weiterePersonen: z.array(
    z.object({
      ...namePrivatPerson,
      ...adresseSchema,
      telefonnummer: optionalOrSchema(phoneNumberSchema),
      unter18JahreAlt: checkedOptional,
      ...fluggastrechtePersoenlichVertretungDaten,
    }),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
