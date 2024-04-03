import type { GenericGuard } from "../../guards.server";
import { besitzDone, besitzZusammenfassungDone } from "./navStatesBesitz";
import type { BeratungshilfeFinanzielleAngaben } from "./context";

export type SubflowState = "Done" | "Open";

export type FinanzielleAngabenGuard =
  GenericGuard<BeratungshilfeFinanzielleAngaben>;

export const einkommenDone: FinanzielleAngabenGuard = ({ context }) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  context.einkommen != undefined;

const partnerDone: FinanzielleAngabenGuard = ({ context }) =>
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

const kinderDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasKinder == "no" || context.kinder !== undefined;

const wohnungAloneDone: FinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation === "alone" &&
  context.apartmentCostAlone !== undefined;

const wohnungWithOthersDone: FinanzielleAngabenGuard = ({ context }) =>
  (context.livingSituation === "withOthers" ||
    context.livingSituation === "withRelatives") &&
  context.apartmentPersonCount !== undefined &&
  context.apartmentCostOwnShare !== undefined &&
  context.apartmentCostFull !== undefined;

const wohnungDone: FinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation !== undefined &&
  context.apartmentSizeSqm !== undefined &&
  (wohnungAloneDone({ context }) || wohnungWithOthersDone({ context }));

const andereUnterhaltszahlungenDone: FinanzielleAngabenGuard = ({ context }) =>
  context.hasOtherMaintenancePayments == "no" ||
  (context.unterhaltszahlungen !== undefined &&
    context.unterhaltszahlungen.length > 0);

const subflowDoneConfig: Record<string, FinanzielleAngabenGuard> = {
  einkommen: einkommenDone,
  partner: partnerDone,
  kinder: kinderDone,
  besitz: besitzDone,
  besitzZusammenfassung: besitzZusammenfassungDone,
  wohnung: wohnungDone,
  "andere-unterhaltszahlungen": andereUnterhaltszahlungenDone,
};

export const beratungshilfeFinanzielleAngabenSubflowState = (
  context: BeratungshilfeFinanzielleAngaben,
  subflowId: string,
): SubflowState => {
  if (
    subflowId in subflowDoneConfig &&
    subflowDoneConfig[subflowId]({ context })
  ) {
    return "Done";
  }
  return "Open";
};

export const beratungshilfeFinanzielleAngabeDone: GenericGuard<
  BeratungshilfeFinanzielleAngaben
> = ({ context }) => {
  switch (context.staatlicheLeistungen) {
    case "asylbewerberleistungen":
    case "grundsicherung":
      return true;
    case "buergergeld":
      return besitzDone({ context }) && besitzZusammenfassungDone({ context });
    case "andereLeistung":
    case "keine":
      return (
        partnerDone({ context }) &&
        besitzDone({ context }) &&
        besitzZusammenfassungDone({ context }) &&
        einkommenDone({ context }) &&
        wohnungDone({ context }) &&
        andereUnterhaltszahlungenDone({ context })
      );
  }
  return false;
};
