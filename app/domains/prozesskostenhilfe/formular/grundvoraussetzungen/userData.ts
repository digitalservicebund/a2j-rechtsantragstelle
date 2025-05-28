import { z } from "zod";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeGrundvoraussetzungenInputSchema = {
  formularArt: z.enum(
    ["nachueberpruefung", "erstantrag"],
    customRequiredErrorMessage,
  ),
  gerichtName: stringOptionalSchema,
  aktenzeichen: stringOptionalSchema,
  verfahrenArt: z.enum(
    ["verfahrenSelbststaendig", "verfahrenAnwalt"],
    customRequiredErrorMessage,
  ),
  versandArt: z.enum(["digital", "analog"], customRequiredErrorMessage),
};

const _partialSchema = z
  .object(prozesskostenhilfeGrundvoraussetzungenInputSchema)
  .partial();
export type ProzesskostenhilfeGrundvoraussetzungenUserData = z.infer<
  typeof _partialSchema
>;
