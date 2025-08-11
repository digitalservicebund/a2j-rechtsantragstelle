import { z } from "zod";
import type { ErrorMessageProps } from "~/components/types";
import { emailSchema } from "~/services/validation/email";

export const emailCaptureConsentName = "emailCaptureConsent";

export const invalidEmailError: ErrorMessageProps = {
  code: "invalid",
  text: "Bitte verwenden Sie eine gültige E-Mail Adresse",
};

export const emailCaptureSchema = z.object({
  email: emailSchema,
});
