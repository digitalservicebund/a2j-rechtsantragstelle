import { z } from "zod";
import type { GenericGuard } from "~/flows/guards.server";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeGrundvoraussetzungen = {
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
  // TODO: revisit for versandDigitalAnwalt/versandDigitalGericht
  versandArt: z.enum(["digital", "analog"], customRequiredErrorMessage),
  shouldUseMJP: YesNoAnswer,
};

const _contextObject = z
  .object(prozesskostenhilfeGrundvoraussetzungen)
  .partial();
export type ProzesskostenhilfeGrundvoraussetzungenContext = z.infer<
  typeof _contextObject
>;

export const formularIsNachueberpruefung: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.formularArt === "nachueberpruefung";

export const grundvoraussetzungDone: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => {
  // TODO: add done logic
  console.log(context);
  return false;
};
