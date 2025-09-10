import { childDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { arrayIsNonEmpty } from "~/util/array";
import { hasStaatlicheLeistungen } from "../einkommen/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../guards";

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasStaatlicheLeistungen({ context }) ||
  context.hasKinder == "no" ||
  (arrayIsNonEmpty(context.kinder) && context.kinder.every(childDone));
