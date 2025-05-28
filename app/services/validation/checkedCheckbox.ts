import { z } from "zod";
import { customRequiredErrorMessage } from "./YesNoAnswer";

export const checkedRequired = z.enum(["on"], customRequiredErrorMessage);

export const checkedOptional = z.enum(
  ["on", "off"],
  customRequiredErrorMessage,
);
