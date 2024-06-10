import type { BeratungshilfeFinanzielleAngaben } from "./context";
import { eigentumZusammenfassungDone } from "./eigentumZusammenfassungDone";
import { einkommenDone as einkommenDoneGuard } from "./guards";
import { eigentumDone } from "./navStatesEigentum";
import type { GenericGuard } from "../../guards.server";

export type FinanzielleAngabenGuard =
  GenericGuard<BeratungshilfeFinanzielleAngaben>;

export const einkommenDone: FinanzielleAngabenGuard = ({ context }) =>
  einkommenDoneGuard({ context });

export const partnerDone: FinanzielleAngabenGuard = ({ context }) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  ["no", "widowed"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

const hasStaatlicheLeistungen: FinanzielleAngabenGuard = ({ context }) =>
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  context.staatlicheLeistungen == "buergergeld" ||
  context.staatlicheLeistungen == "grundsicherung";

export const kinderDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasKinder == "no" ||
  (context.kinder !== undefined && context.kinder.length > 0);

const wohnungAloneDone: FinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation === "alone" &&
  context.apartmentCostAlone !== undefined;

const wohnungWithOthersDone: FinanzielleAngabenGuard = ({ context }) =>
  (context.livingSituation === "withOthers" ||
    context.livingSituation === "withRelatives") &&
  context.apartmentPersonCount !== undefined &&
  context.apartmentCostOwnShare !== undefined &&
  context.apartmentCostFull !== undefined;

export const wohnungDone: FinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation !== undefined &&
  context.apartmentSizeSqm !== undefined &&
  (wohnungAloneDone({ context }) || wohnungWithOthersDone({ context }));

export const andereUnterhaltszahlungenDone: FinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  context.hasWeitereUnterhaltszahlungen == "no" ||
  (context.unterhaltszahlungen !== undefined &&
    context.unterhaltszahlungen.length > 0);

export const ausgabenDone: FinanzielleAngabenGuard = ({ context }) => {
  return (
    context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" &&
      context.ausgaben !== undefined &&
      context.ausgaben.length > 0)
  );
};

export const beratungshilfeFinanzielleAngabeDone: GenericGuard<
  BeratungshilfeFinanzielleAngaben
> = ({ context }) => {
  switch (context.staatlicheLeistungen) {
    case "asylbewerberleistungen":
    case "grundsicherung":
      return true;
    case "buergergeld":
      return (
        eigentumDone({ context }) && eigentumZusammenfassungDone({ context })
      );
    case "keine":
      return (
        partnerDone({ context }) &&
        eigentumDone({ context }) &&
        eigentumZusammenfassungDone({ context }) &&
        einkommenDone({ context }) &&
        wohnungDone({ context }) &&
        andereUnterhaltszahlungenDone({ context })
      );
  }
  return false;
};
