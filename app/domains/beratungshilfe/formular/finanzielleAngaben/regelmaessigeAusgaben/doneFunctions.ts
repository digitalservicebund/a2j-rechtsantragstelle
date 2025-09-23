import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngabenUserData } from "../userData";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";

export const ausgabeDone = (
  ausgabe: NonNullable<BeratungshilfeFinanzielleAngabenUserData["ausgaben"]>[0],
) =>
  ausgabe.art !== undefined &&
  ausgabe.zahlungsempfaenger !== undefined &&
  ausgabe.beitrag !== undefined &&
  (ausgabe.hasZahlungsfrist === "no" ||
    (ausgabe.hasZahlungsfrist === "yes" &&
      ausgabe.zahlungsfrist !== undefined));

export const ausgabenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  return (
    context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" &&
      context.ausgabensituation !== undefined &&
      arrayIsNonEmpty(context.ausgaben) &&
      context.ausgaben.every(ausgabeDone))
  );
};
