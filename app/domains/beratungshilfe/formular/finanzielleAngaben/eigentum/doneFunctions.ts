import {
  singleGrundeigentumDone,
  bankKontoDone,
  geldanlageDone,
} from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../guards";
import { type BeratungshilfeFinanzielleAngabenUserData } from "../userData";

export const geldanlagenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    arrayIsNonEmpty(context.geldanlagen) &&
    context.geldanlagen.every(geldanlageDone));

const kraftfahrzeugDone = (
  kraftfahrzeug: NonNullable<
    BeratungshilfeFinanzielleAngabenUserData["kraftfahrzeuge"]
  >[0],
) =>
  kraftfahrzeug.hasArbeitsweg !== undefined &&
  kraftfahrzeug.wert !== undefined &&
  (kraftfahrzeug.wert === "under10000" ||
    (kraftfahrzeug.art !== undefined &&
      kraftfahrzeug.marke !== undefined &&
      kraftfahrzeug.kilometerstand !== undefined &&
      kraftfahrzeug.baujahr !== undefined &&
      kraftfahrzeug.eigentuemer !== undefined));

export const kraftfahrzeugeDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge) &&
    context.kraftfahrzeuge.every(kraftfahrzeugDone));

export const wertsachenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" && arrayIsNonEmpty(context.wertsachen));

export const grundeigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum) &&
    context.grundeigentum.every(singleGrundeigentumDone));

export const eigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "grundsicherung" ||
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  (bankKontoDone({ context }) &&
    geldanlagenDone({ context }) &&
    grundeigentumDone({ context }) &&
    wertsachenDone({ context }) &&
    kraftfahrzeugeDone({ context }));
