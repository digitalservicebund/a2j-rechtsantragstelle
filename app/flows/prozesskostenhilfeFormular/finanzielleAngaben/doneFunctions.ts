import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  finanzielleAngabeEinkuenfteGuards as einkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { arrayIsNonEmpty } from "~/util/array";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  prozesskostenhilfeFinanzielleAngabenContext,
  type ProzesskostenhilfeFinanzielleAngabenContext,
} from "./context";
import { eigentumDone } from "./eigentumDone";
import type { GenericGuard } from "../../guards.server";
import {
  bankKontoDone,
  childDone,
  geldanlageDone,
  singleGrundeigentumDone,
} from "../../shared/finanzielleAngaben/doneFunctions";

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
  context.partnerEinkommen == "no" ||
  partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  (partnerEinkuenfteDone({ context }) &&
    partnerBesondersAusgabenDone({ context }));

// Reuse the existing einkuenfteDone guard by removing the partner- prefix from context values
export const partnerEinkuenfteDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    einkuenfteDone({
      context: {
        ...context,
        ...Object.fromEntries(
          Object.entries(context)
            .filter(([key]) => key.includes("partner-"))
            .map(([key, val]) => [key.replace("partner-", ""), val]),
        ),
      },
    }) && partnerSupportDone({ context });

export const partnerBesondersAusgabenDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerHasBesondersAusgaben === "no" ||
    (context.partnerHasBesondersAusgaben != undefined &&
      objectKeysNonEmpty(context.partnerBesondersAusgabe, [
        "beschreibung",
        "betrag",
      ]));

export const kinderDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })) ||
  context.hasKinder == "no" ||
  (arrayIsNonEmpty(context.kinder) && context.kinder.every(childDone));

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
  (context.hasGeldanlage === "yes" &&
    arrayIsNonEmpty(context.geldanlagen) &&
    context.geldanlagen.every(geldanlageDone));

export const grundeigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum) &&
    context.grundeigentum.every(singleGrundeigentumDone));

export const kraftfahrzeugDone = (
  kfz: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenContext["kraftfahrzeuge"]
  >[0],
) =>
  kfz.hasArbeitsweg !== undefined &&
  kfz.wert !== undefined &&
  kfz.eigentuemer !== undefined &&
  kfz.art !== undefined &&
  kfz.marke !== undefined &&
  kfz.kilometerstand !== undefined &&
  kfz.baujahr !== undefined;

export const kraftfahrzeugeDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge) &&
    context.kraftfahrzeuge.every(kraftfahrzeugDone));

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

export const versicherungDone = (
  versicherung: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenContext["versicherungen"]
  >[0],
) => {
  if (versicherung.art === "sonstige") {
    return versicherung.sonstigeArt !== undefined;
  }
  return true;
};

export const hasVersicherungDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  arrayIsNonEmpty(context.versicherungen) &&
  context.versicherungen.every(versicherungDone);

export const ratenzahlungDone = (
  ratenzahlung: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenContext["ratenzahlungen"]
  >[0],
) =>
  !!ratenzahlung &&
  ratenzahlung.art !== undefined &&
  ratenzahlung.zahlungsempfaenger !== undefined &&
  ratenzahlung.zahlungspflichtiger !== undefined &&
  (ratenzahlung.zahlungspflichtiger === "myself" ||
    ratenzahlung.betragEigenerAnteil !== undefined) &&
  ratenzahlung.betragGesamt !== undefined &&
  ratenzahlung.restschuld !== undefined &&
  ratenzahlung.laufzeitende !== undefined;

export const hasRatenzahlungDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  arrayIsNonEmpty(context.ratenzahlungen) &&
  context.ratenzahlungen.every(ratenzahlungDone);

export const sonstigeAusgabeDone = (
  sonstigeAusgabe: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenContext["sonstigeAusgaben"]
  >[0],
) =>
  !!sonstigeAusgabe &&
  sonstigeAusgabe.art !== undefined &&
  sonstigeAusgabe.zahlungsempfaenger !== undefined &&
  sonstigeAusgabe.zahlungspflichtiger !== undefined &&
  (sonstigeAusgabe.zahlungspflichtiger === "myself" ||
    sonstigeAusgabe.betragEigenerAnteil !== undefined) &&
  sonstigeAusgabe.betragGesamt !== undefined;

export const hasSonstigeAusgabeDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    arrayIsNonEmpty(context.sonstigeAusgaben) &&
    context.sonstigeAusgaben.every(sonstigeAusgabeDone);

export const partnerSupportDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  if (context["partner-receivesSupport"] === undefined) return false;
  return context["partner-receivesSupport"] === "yes"
    ? context["partner-supportAmount"] !== undefined
    : true;
};
