import type { GenericGuard } from "../../guards.server";
import { besitzDone, besitzZusammenfassungDone } from "./navStatesBesitz";
import type { BeratungshilfeFinanzielleAngaben } from "./context";

export type SubflowState = "Done" | "Open";

export type FinanzielleAngabenGuard =
  GenericGuard<BeratungshilfeFinanzielleAngaben>;

const einkommenDone: FinanzielleAngabenGuard = ({ context }) =>
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

type SubflowNavigationConfig = Record<
  string,
  {
    done: FinanzielleAngabenGuard;
  }
>;

const subflowNavigationConfig: SubflowNavigationConfig = {
  einkommen: {
    done: einkommenDone,
  },
  partner: {
    done: partnerDone,
  },
  kinder: {
    done: kinderDone,
  },
  besitz: {
    done: besitzDone,
  },
  besitzZusammenfassung: {
    done: besitzZusammenfassungDone,
  },
  wohnung: {
    done: wohnungDone,
  },
};

export const beratungshilfeFinanzielleAngabenSubflowState = (
  context: BeratungshilfeFinanzielleAngaben,
  subflowId: string,
): SubflowState => {
  if (subflowId in subflowNavigationConfig) {
    const subflowConfig = subflowNavigationConfig[subflowId];
    if (subflowConfig.done({ context })) return "Done";
  }
  return "Open";
};

export const beratungshilfeFinanzielleAngabeDone: GenericGuard<
  BeratungshilfeFinanzielleAngaben
> = ({ context }) =>
  //FIXME: skip nonreachable / hidden subflows
  Object.keys(subflowNavigationConfig)
    .map((subflowId) =>
      beratungshilfeFinanzielleAngabenSubflowState(context, subflowId),
    )
    .find((state) => state === "Open") === undefined;
