import { arrayIsNonEmpty } from "~/util/array";
import { hasStaatlicheLeistungen } from "../einkommen/doneFunctions";
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
    hasStaatlicheLeistungen({ context }) ||
    context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" &&
      arrayIsNonEmpty(context.ausgaben) &&
      context.ausgaben.every(ausgabeDone))
  );
};
