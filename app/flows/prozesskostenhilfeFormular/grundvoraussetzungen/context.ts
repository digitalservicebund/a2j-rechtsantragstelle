import { z } from "zod";
import type { GenericGuard } from "~/flows/guards.server";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

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
  versandArt: z.enum(["digital", "analog"], customRequiredErrorMessage),
};

const _contextObject = z
  .object(prozesskostenhilfeGrundvoraussetzungen)
  .partial();
export type ProzesskostenhilfeGrundvoraussetzungenContext = z.infer<
  typeof _contextObject
>;

export const verfahrenAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.verfahrenArt === "verfahrenAnwalt";

export const erstantrag: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.formularArt === "erstantrag";

export const nachueberpruefung: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.formularArt === "nachueberpruefung";

export const verfahrenSelbststaendig: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.verfahrenArt === "verfahrenSelbststaendig";

export const versandDigitalAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) =>
  erstantrag({ context }) &&
  verfahrenAnwalt({ context }) &&
  context.versandArt === "digital";

export const versandDigitalGericht: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) =>
  (erstantrag({ context }) &&
    verfahrenSelbststaendig({ context }) &&
    context.versandArt === "digital") ||
  (context.formularArt === "nachueberpruefung" &&
    context.versandArt === "digital");

export const grundvoraussetzungenDone: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => {
  const shouldTestVerfahrenArt = erstantrag({ context });
  return !(
    context.formularArt === undefined ||
    context.versandArt === undefined ||
    (shouldTestVerfahrenArt && context.verfahrenArt === undefined)
  );
};
