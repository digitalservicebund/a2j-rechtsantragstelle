import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { hasGrundsicherungOrAsylbewerberleistungen } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { arrayIsNonEmpty } from "~/util/array";
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import type { GenericGuard } from "../../guards.server";
import { bankKontoDone } from "../../shared/finanzielleAngaben/doneFunctions";

type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenContext>;

export const partnerDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  ["no", "widowed"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

export const kinderDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  context.hasKinder == "no" ||
  arrayIsNonEmpty(context.kinder);

export const andereUnterhaltszahlungenDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasGrundsicherungOrAsylbewerberleistungen({
      context,
    }) ||
    context.hasWeitereUnterhaltszahlungen == "no" ||
    arrayIsNonEmpty(context.unterhaltszahlungen);

export const geldanlagenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" && arrayIsNonEmpty(context.geldanlagen));

export const grundeigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum));

export const kraftfahrzeugeDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge));

export const wertsachenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasWertsache === "no" ||
  (context.hasWertsache === "yes" && arrayIsNonEmpty(context.wertsachen));

export const prozesskostenhilfeFinanzielleAngabeDone: GenericGuard<
  ProzesskostenhilfeFinanzielleAngabenContext
> = ({ context }) =>
  einkuenfteDone({ context }) &&
  partnerDone({ context }) &&
  eigentumDone({ context }) &&
  kinderDone({ context }) &&
  eigentumZusammenfassungDone({ context }) &&
  andereUnterhaltszahlungenDone({ context }) &&
  ausgabenDone({ context }) &&
  ausgabenZusammenfassungDone({ context });

export const eigentumZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasGrundsicherungOrAsylbewerberleistungen({
      context,
    }) ||
    (bankKontoDone({ context }) &&
      geldanlagenDone({ context }) &&
      grundeigentumDone({ context }) &&
      wertsachenDone({ context }) &&
      kraftfahrzeugeDone({ context }));

export const eigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  (context.hasBankkonto !== undefined &&
    context.hasKraftfahrzeug !== undefined &&
    context.hasGeldanlage !== undefined &&
    context.hasGrundeigentum !== undefined &&
    context.hasWertsache !== undefined);

export const ausgabenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.hasAusgaben !== undefined &&
    context.besondereBelastungen !== undefined) ||
  context.hasAusgaben ==
    prozesskostenhilfeFinanzielleAngabenContext.hasAusgaben.Enum.no;

export const ausgabenZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.hasAusgaben ==
      prozesskostenhilfeFinanzielleAngabenContext.hasAusgaben.Enum.no ||
    hasVersicherungDone({ context }) ||
    hasRatenzahlungDone({ context }) ||
    hasSonstigeAusgabeDone({ context });

export const hasVersicherungDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => arrayIsNonEmpty(context.versicherungen);

export const hasRatenzahlungDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => arrayIsNonEmpty(context.ratenzahlungen);

export const hasSonstigeAusgabeDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) => arrayIsNonEmpty(context.sonstigeAusgaben);
