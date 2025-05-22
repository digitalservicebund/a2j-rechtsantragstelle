import { z } from "zod";
import type { GenericGuard } from "~/domains/guards.server";
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

export const verfahrenAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.verfahrenArt === "verfahrenAnwalt";

export const erstantrag: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.formularArt === "erstantrag";

export const nachueberpruefung: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.formularArt === "nachueberpruefung";

export const verfahrenSelbststaendig: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => context.verfahrenArt === "verfahrenSelbststaendig";

export const versandDigitalAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) =>
  erstantrag({ context }) &&
  verfahrenAnwalt({ context }) &&
  context.versandArt === "digital";

export const versandDigitalGericht: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) =>
  (erstantrag({ context }) &&
    verfahrenSelbststaendig({ context }) &&
    context.versandArt === "digital") ||
  (context.formularArt === "nachueberpruefung" &&
    context.versandArt === "digital");

export const grundvoraussetzungenDone: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenUserData
> = ({ context }) => {
  const shouldTestVerfahrenArt = erstantrag({ context });
  return !(
    context.formularArt === undefined ||
    context.versandArt === undefined ||
    (shouldTestVerfahrenArt && context.verfahrenArt === undefined)
  );
};
