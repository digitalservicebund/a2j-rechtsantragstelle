import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const eigentuemer = z.enum(
  ["myself", "partner", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);
