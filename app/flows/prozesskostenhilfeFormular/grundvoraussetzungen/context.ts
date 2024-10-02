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

export const versandDigitalAnwalt: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) =>
  context.formularArt === "erstantrag" &&
  context.verfahrenArt === "verfahrenAnwalt" &&
  context.versandArt === "digital";

export const versandDigitalGericht: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) =>
  (context.formularArt === "erstantrag" &&
    context.verfahrenArt === "verfahrenSelbststaendig" &&
    context.versandArt === "digital") ||
  (context.formularArt === "nachueberpruefung" &&
    context.versandArt === "digital");

export const shouldUseMJP: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => context.shouldUseMJP === "yes";

export const grundvoraussetzungenDone: GenericGuard<
  ProzesskostenhilfeGrundvoraussetzungenContext
> = ({ context }) => {
  const shouldTestMJP = versandDigitalGericht({ context });
  const shouldTestVerfahrenArt = context.formularArt === "erstantrag";
  return !(
    context.formularArt === undefined ||
    context.versandArt === undefined ||
    (shouldTestVerfahrenArt && context.verfahrenArt === undefined) ||
    (shouldTestMJP && context.shouldUseMJP === undefined)
  );
};
