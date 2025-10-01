import { einkuenfteDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";
import {
  finanzielleAngabeEinkuenfteGuards as einkuenfteGuards,
  partnerEinkuenfteGuards,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import { partnerEinkuenfteDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/doneFunctions";
import { arrayIsNonEmpty } from "~/util/array";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";
import type { GenericGuard } from "../../../guards.server";
import {
  bankKontoDone,
  childDone,
  geldanlageDone,
  singleGrundeigentumDone,
} from "../../../shared/formular/finanzielleAngaben/doneFunctions";
import {
  ratenZahlungArraySchema,
  sonstigeZahlungArraySchema,
  versicherungenArraySchema,
} from "./ausgaben/pages";

type ProzesskostenhilfeFinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenUserData>;

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

const partnerNameDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.partnerVorname !== undefined && context.partnerNachname !== undefined;

export const partnerDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen !== undefined &&
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })) ||
  ["no", "widowed", "separated"].includes(context.partnerschaft ?? "") ||
  context.unterhalt === "no" ||
  context.partnerEinkommen === "no" ||
  (context.unterhalt === "yes" &&
    context.partnerUnterhaltsSumme !== undefined &&
    partnerNameDone({ context })) ||
  partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
    context,
  }) ||
  (partnerEinkuenfteDone({ context }) &&
    partnerSupportDone({ context }) &&
    partnerBesondersAusgabenDone({ context }));

export const partnerBesondersAusgabenDone: ProzesskostenhilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerHasBesondersAusgaben === "no" ||
    (context.partnerHasBesondersAusgaben === "yes" &&
      objectKeysNonEmpty(context.partnerBesondersAusgabe, [
        "beschreibung",
        "betrag",
      ]));

export const kinderDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
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

const geldanlagenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    arrayIsNonEmpty(context.geldanlagen) &&
    context.geldanlagen.every(geldanlageDone));

const grundeigentumDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum) &&
    context.grundeigentum.every(singleGrundeigentumDone));

export const kraftfahrzeugDone = (
  kfz: NonNullable<
    ProzesskostenhilfeFinanzielleAngabenUserData["kraftfahrzeuge"]
  >[0],
) =>
  kfz.hasArbeitsweg !== undefined &&
  kfz.wert !== undefined &&
  (kfz.wert === "under10000" ||
    (kfz.eigentuemer !== undefined &&
      kfz.art !== undefined &&
      kfz.marke !== undefined &&
      kfz.kilometerstand !== undefined &&
      kfz.baujahr !== undefined));

const kraftfahrzeugeDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasKraftfahrzeug === "no" ||
  (context.hasKraftfahrzeug === "yes" &&
    arrayIsNonEmpty(context.kraftfahrzeuge) &&
    context.kraftfahrzeuge.every(kraftfahrzeugDone));

const wertsachenDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
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
          ausgabenDone({ context });
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
  context.besondereBelastungen !== undefined &&
  (context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" &&
      (versicherungenArraySchema.safeParse(context.versicherungen).success ||
        ratenZahlungArraySchema.safeParse(context.ratenzahlungen).success ||
        sonstigeZahlungArraySchema.safeParse(context.sonstigeAusgaben)
          .success)));

export const partnerSupportDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  if (context["partner-receivesSupport"] === undefined) return false;
  return context["partner-receivesSupport"] === "yes"
    ? context["partner-supportAmount"] !== undefined
    : true;
};

export const wohnungDone: ProzesskostenhilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  const livesAlone = context.livingSituation === "alone";
  const rentsApartment = context.rentsApartment === "yes" && context.totalRent;
  const parkplatzDone = context.garageParkplatz !== undefined;

  const ownsApartment =
    context.rentsApartment === "no" &&
    context.utilitiesCostOwned &&
    context.heatingCostsOwned;

  const livesWithOthers =
    (context.livingSituation === "withOthers" ||
      context.livingSituation === "withRelatives") &&
    context.apartmentPersonCount;

  const renterInfoDone =
    rentsApartment &&
    parkplatzDone &&
    (livesAlone || (livesWithOthers && context.sharedRent));

  const ownerInfoDone =
    ownsApartment &&
    (livesAlone || (livesWithOthers && context.utilitiesCostOwnShared));

  return (
    Boolean(context.apartmentSizeSqm && context.numberOfRooms) &&
    (Boolean(renterInfoDone) || Boolean(ownerInfoDone))
  );
};
