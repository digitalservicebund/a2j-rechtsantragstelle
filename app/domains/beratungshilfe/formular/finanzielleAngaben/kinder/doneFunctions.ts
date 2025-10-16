import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";
import { kinderArraySchema } from "./pages";

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKinder === "no" ||
  (context.hasKinder === "yes" &&
    kinderArraySchema.safeParse(context.kinder).success);
