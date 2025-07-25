import { z } from "zod";

export const customRequiredErrorMessage = { error: "required" };
export const YesNoAnswer = z.enum(["yes", "no"], customRequiredErrorMessage);
