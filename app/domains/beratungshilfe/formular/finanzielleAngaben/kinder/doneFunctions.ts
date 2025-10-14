import { kinderArraySchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKinder === "no" ||
  (context.hasKinder === "yes" &&
    kinderArraySchema.safeParse(context.kinder).success);
