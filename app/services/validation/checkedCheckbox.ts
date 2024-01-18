import { z } from "zod";
import { customRequiredErrorMessage } from "./YesNoAnswer";
import { CheckboxValue } from "~/components/inputs/Checkbox";

export const checkedRequired = z.enum(
  [CheckboxValue.on],
  customRequiredErrorMessage,
);

export const checkedOptional = z.nativeEnum(
  CheckboxValue,
  customRequiredErrorMessage,
);
