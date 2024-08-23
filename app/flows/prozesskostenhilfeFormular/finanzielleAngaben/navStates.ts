import { arrayIsNonEmpty } from "~/util/array";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./context";
import {
  eigentumDone as eigentumDoneGuard,
  hasGrundsicherungOrAsylberberleistungen,
} from "./guards";
import type { GenericGuard } from "../../guards.server";
import {
  bankKontoDone,
  geldanlagenDone,
  grundeigentumDone,
  kraftfahrzeugeDone,
  wertsachenDone,
} from "../../shared/finanzielleAngaben/navStates";

export type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenContext>;

export const einkuenfteDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => hasGrundsicherungOrAsylberberleistungen({ context });

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

export const eigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasGrundsicherungOrAsylberberleistungen({
    context,
  }) || eigentumDoneGuard({ context });

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
