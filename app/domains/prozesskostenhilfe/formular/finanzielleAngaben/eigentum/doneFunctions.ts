import { GenericGuard } from "~/domains/guards.server";
import { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";
import {
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  wertsachenArraySchema,
} from "./pages";
import { arrayIsNonEmpty } from "~/util/array";
type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenUserData>;

export const bankKontoDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasBankkonto === "no" ||
  (context.hasBankkonto === "yes" &&
    bankkontenArraySchema.safeParse(context.bankkonten).success);

export const kraftfahrzeugDone = (
  kfz: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenUserData["kraftfahrzeuge"]
  >[0],
) =>
  kfz.hasArbeitsweg != undefined &&
  kfz.wert != undefined &&
  (kfz.wert === "under10000" ||
    (kfz.eigentuemer != undefined &&
      kfz.art != undefined &&
      kfz.marke != undefined &&
      kfz.kilometerstand != undefined &&
      kfz.baujahr !== undefined));

export const kraftfahrzeugeDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge) &&
    context.kraftfahrzeuge?.every(kraftfahrzeugDone));
export const geldanlagenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    geldanlagenArraySchema.safeParse(context.geldanlagen).success);

export const grundeigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    grundeigentumArraySchema.safeParse(context.grundeigentum).success);

export const wertsachenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" &&
    wertsachenArraySchema.safeParse(context.wertsachen).success);

export const eigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "grundsicherung" ||
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  (context.hasBankkonto !== undefined &&
    context.hasKraftfahrzeug !== undefined &&
    context.hasGeldanlage !== undefined &&
    context.hasGrundeigentum !== undefined &&
    context.hasWertsache !== undefined);

export const eigentumZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.staatlicheLeistungen == "grundsicherung" ||
    context.staatlicheLeistungen == "asylbewerberleistungen" ||
    (bankKontoDone({ context }) &&
      geldanlagenDone({ context }) &&
      grundeigentumDone({ context }) &&
      wertsachenDone({ context }) &&
      kraftfahrzeugeDone({ context }));
