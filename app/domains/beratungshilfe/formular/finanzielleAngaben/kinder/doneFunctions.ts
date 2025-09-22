import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";
import { childrenArraySchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKinder == "no" ||
  childrenArraySchema.safeParse(context.kinder).success;
