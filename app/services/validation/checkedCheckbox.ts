import { z } from "zod";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import { customRequiredErrorMessage } from "./YesNoAnswer";

export const checkedRequired = z.enum(
  [CheckboxValue.on],
  customRequiredErrorMessage,
);

export const checkedOptional = z.nativeEnum(
  CheckboxValue,
  customRequiredErrorMessage,
);
