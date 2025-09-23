import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";
import { ausgabenArraySchema } from "./pages";

export const ausgabenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  return (
    context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" &&
      context.ausgabensituation !== undefined &&
      ausgabenArraySchema.safeParse(context.ausgaben).success)
  );
};
