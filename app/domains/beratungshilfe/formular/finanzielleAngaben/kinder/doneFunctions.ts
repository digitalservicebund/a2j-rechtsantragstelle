import { childDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKinder == "no" ||
  (arrayIsNonEmpty(context.kinder) && context.kinder.every(childDone));
