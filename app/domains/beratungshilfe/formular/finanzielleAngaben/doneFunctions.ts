import type { BeratungshilfeFinanzielleAngabenGuard } from "~/domains/beratungshilfe/formular/finanzielleAngaben/BeratungshilfeFinanzielleAngabenGuardType";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";
import {
  bankKontoDone,
  childDone,
  geldanlageDone,
  singleGrundeigentumDone,
} from "~/domains/shared/formular/finanzielleAngaben/doneFunctions";
import { arrayIsNonEmpty } from "~/util/array";
import { hasStaatlicheLeistungen } from "./einkommen/doneFunctions";

export const partnerDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  ["no", "widowed", "separated"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasStaatlicheLeistungen({ context }) ||
  context.hasKinder == "no" ||
  (arrayIsNonEmpty(context.kinder) && context.kinder.every(childDone));

const wohnungAloneDone: BeratungshilfeFinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation === "alone" &&
  context.apartmentCostAlone !== undefined;

const wohnungWithOthersDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.livingSituation === "withOthers" ||
    context.livingSituation === "withRelatives") &&
  context.apartmentPersonCount !== undefined &&
  context.apartmentCostOwnShare !== undefined &&
  context.apartmentCostFull !== undefined;

export const wohnungDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasStaatlicheLeistungen({ context }) ||
  (context.livingSituation !== undefined &&
    context.apartmentSizeSqm !== undefined &&
    (wohnungAloneDone({ context }) || wohnungWithOthersDone({ context })));

export const andereUnterhaltszahlungenDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      hasStaatlicheLeistungen({ context })) ||
    context.hasWeitereUnterhaltszahlungen == "no" ||
    arrayIsNonEmpty(context.unterhaltszahlungen);

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

export const geldanlagenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGeldanlage === "no" ||
  (context.hasGeldanlage === "yes" &&
    arrayIsNonEmpty(context.geldanlagen) &&
    context.geldanlagen.every(geldanlageDone));

export const grundeigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.hasGrundeigentum === "no" ||
  (context.hasGrundeigentum === "yes" &&
    arrayIsNonEmpty(context.grundeigentum) &&
    context.grundeigentum.every(singleGrundeigentumDone));

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
