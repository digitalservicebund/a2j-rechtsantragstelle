import { z } from "zod";
import type { ZodErrorMap } from "zod";

export const customRequiredErrorMessage: { errorMap: ZodErrorMap } = {
  errorMap: () => ({ message: "required" }),
};
export const YesNoAnswer = z.enum(["yes", "no"], customRequiredErrorMessage);

export const YesNoMaybeAnswer = z.enum(
  ["yes", "no", "maybe"],
  customRequiredErrorMessage,
);
