import { bankKontoDone } from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenGuard } from "../BeratungshilfeFinanzielleAngabenGuardType";
import {
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  wertsachenArraySchema,
} from "~/domains/beratungshilfe/formular/finanzielleAngaben/eigentum/pages";

export const geldanlagenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    geldanlagenArraySchema.safeParse(context.geldanlagen).success);

export const kraftfahrzeugeDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    kraftfahrzeugeArraySchema.safeParse(context.kraftfahrzeuge).success);

export const wertsachenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" &&
    wertsachenArraySchema.safeParse(context.wertsachen).success);

export const grundeigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    grundeigentumArraySchema.safeParse(context.grundeigentum).success);

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
