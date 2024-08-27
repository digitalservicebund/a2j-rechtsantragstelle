import { hasAnyEigentumExceptBankaccount } from "~/flows/shared/finanzielleAngaben/guards";
import { arrayIsNonEmpty } from "~/util/array";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./context";
import { hasGrundsicherungOrAsylberberleistungen, notEmployed } from "./guards";
import type { GenericGuard } from "../../guards.server";
import {
  bankKontoDone,
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "../../shared/finanzielleAngaben/doneFunctions";

export type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenContext>;

export const einkuenfteDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylberberleistungen({ context }) ||
  !notEmployed({ context }); // TODO: remove after einkuenfte complete

export const partnerDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylberberleistungen({
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
  hasGrundsicherungOrAsylberberleistungen({
    context,
  }) ||
  context.hasKinder == "no" ||
  arrayIsNonEmpty(context.kinder);

export const andereUnterhaltszahlungenDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasGrundsicherungOrAsylberberleistungen({
      context,
    }) ||
    context.hasWeitereUnterhaltszahlungen == "no" ||
    arrayIsNonEmpty(context.unterhaltszahlungen);

export const prozesskostenhilfeFinanzielleAngabeDone: GenericGuard<
  ProzesskostenhilfeFinanzielleAngabenContext
> = ({ context }) =>
  einkuenfteDone({ context }) &&
  partnerDone({ context }) &&
  eigentumDone({ context }) &&
  kinderDone({ context }) &&
  eigentumZusammenfassungDone({ context }) &&
  andereUnterhaltszahlungenDone({ context });

export const eigentumZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasGrundsicherungOrAsylberberleistungen({
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
  context.hasBankkonto !== undefined &&
  context.hasKraftfahrzeug !== undefined &&
  context.hasGeldanlage !== undefined &&
  context.hasGrundeigentum !== undefined &&
  context.hasWertsache !== undefined &&
  (!hasAnyEigentumExceptBankaccount({ context }) ||
    context.eigentumTotalWorth !== undefined);
