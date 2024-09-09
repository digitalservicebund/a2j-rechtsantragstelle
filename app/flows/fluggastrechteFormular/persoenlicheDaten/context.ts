import { z } from "zod";
import {
  adresseSchema,
  namePrivatPerson,
} from "~/flows/shared/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const fluggastrechtePersoenlichVertretungDaten = {
  vornameVertretung: stringRequiredSchema,
  nachnameVertretung: stringRequiredSchema,
  strasseHausnummerVertretung: stringRequiredSchema,
  plzVertretung: stringRequiredSchema.pipe(postcodeSchema).optional(),
  ortVertretung: stringRequiredSchema,
  beschreibenVertretung: stringRequiredSchema,
};

export const fluggastrechtePersoenlichDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer: optionalOrSchema(phoneNumberSchema),
  unter18JahreAlt: checkedOptional,
  ...fluggastrechtePersoenlichVertretungDaten,
  isWeiterePersonen: YesNoAnswer,
  weiterePersonen: z.array(
    z
      .object({
        ...namePrivatPerson,
        ...adresseSchema,
        telefonnummer: optionalOrSchema(phoneNumberSchema),
        unter18JahreAlt: checkedOptional,
        ...fluggastrechtePersoenlichVertretungDaten,
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(fluggastrechtePersoenlichDaten).partial();
export type FluggastrechtePersoenlichDaten = z.infer<typeof _contextObject>;
