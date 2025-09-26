import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";
import { ausgabenArraySchema } from "./pages";

export const ausgabenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  return (
    context.ausgabensituation !== undefined &&
    (context.hasAusgaben === "no" ||
      (context.hasAusgaben === "yes" &&
        ausgabenArraySchema.safeParse(context.ausgaben).success))
  );
};
