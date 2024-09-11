import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { arrayIsNonEmpty } from "~/util/array";
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import { eigentumDone } from "./eigentumDone";
import type { GenericGuard } from "../../guards.server";
import { bankKontoDone } from "../../shared/finanzielleAngaben/doneFunctions";

export type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenContext>;

export const partnerDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })) ||
  ["no", "widowed", "separated"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

export const kinderDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })) ||
  context.hasKinder == "no" ||
  arrayIsNonEmpty(context.kinder);

export const andereUnterhaltszahlungenDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
        context,
      })) ||
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

export const prozesskostenhilfeFinanzielleAngabeDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) => {
    return einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })
      ? true
      : einkuenfteDone({ context }) &&
          partnerDone({ context }) &&
          eigentumDone({ context }) &&
          kinderDone({ context }) &&
          eigentumZusammenfassungDone({ context }) &&
          andereUnterhaltszahlungenDone({ context }) &&
          ausgabenDone({ context }) &&
          ausgabenZusammenfassungDone({ context });
  };

export const eigentumZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.staatlicheLeistungen == "grundsicherung" ||
    context.staatlicheLeistungen == "asylbewerberleistungen" ||
    (bankKontoDone({ context }) &&
      geldanlagenDone({ context }) &&
      grundeigentumDone({ context }) &&
      wertsachenDone({ context }) &&
      kraftfahrzeugeDone({ context }));

export const ausgabenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  (context.hasAusgaben !== undefined &&
    context.besondereBelastungen !== undefined) ||
  context.hasAusgaben ==
    prozesskostenhilfeFinanzielleAngabenContext.hasAusgaben.Enum.no;

export const ausgabenZusammenfassungDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    }) ||
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
