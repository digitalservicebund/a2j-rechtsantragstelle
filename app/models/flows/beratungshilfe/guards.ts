import { freibetrag } from "~/models/beratungshilfe";
import moneyToCents from "../../../services/validation/money/moneyToCents";
import type { BeratungshilfeVorabcheckContext } from "./pages";

type Guard = (context: BeratungshilfeVorabcheckContext) => boolean;

function yesNoGuards<Field extends keyof BeratungshilfeVorabcheckContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context[field] === "no") as Guard,
  };
}

const yesOrNoGuard = (
  field: keyof BeratungshilfeVorabcheckContext,
): Record<string, Guard> => ({
  [`${field}YesOrNo`]: (context) =>
    ["yes", "no"].includes(context[field] ?? ""),
});

const filledGuard = (
  field: keyof BeratungshilfeVorabcheckContext,
): Record<string, Guard> => ({
  [`${field}Filled`]: (context) =>
    //@ts-ignore
    ![null, undefined].includes(context[field] ?? ""),
});

const staatlicheLeistungenYesButNoEigeninitiative: Guard = (context) => {
  return (
    guards.staatlicheLeistungenYes(context) && context.eigeninitiative == "no"
  );
};

const vermoegenAbove10k: Guard = (context) => context.vermoegen === "above_10k";
const vermoegenBelow10k: Guard = (context) => context.vermoegen === "below_10k";
const vermoegenBelow10kAndBuergergeld: Guard = (context) =>
  context.vermoegen === "below_10k" &&
  context.staatlicheLeistungen === "buergergeld";

// TODO: Check warning vs success
const verfuegbaresEinkommenNoAndTriedFreeActions: Guard = (context) =>
  context.verfuegbaresEinkommen === "no" && !anyNonCriticalWarning(context);

const weitereZahlungenSummeIncomeTooHigh: Guard = (context) =>
  isIncomeTooHigh(context);

const weitereZahlungenSummeWithWarnings: Guard = (context) =>
  !isIncomeTooHigh(context) && anyNonCriticalWarning(context);

const anyNonCriticalWarning: Guard = (context) => {
  return context.eigeninitiative == "no";
};

export const isIncomeTooHigh: Guard = (context) => {
  const einkommen = moneyToCents(context.einkommen) ?? 0;
  const miete = moneyToCents(context.miete) ?? 0;
  const zahlungen = moneyToCents(context.weitereZahlungenSumme) ?? 0;
  const unterhalt =
    (context.unterhalt == "yes" && moneyToCents(context.unterhaltSumme)) || 0;

  const calculatedFreibetrag = freibetrag({
    working: context.erwerbstaetigkeit === "yes",
    partnership: context.partnerschaft === "yes",
    partnerIncome: moneyToCents(context.einkommenPartner) ?? 0,
    childrenBelow6: Number(String(context.kids6Below)?.replace(",", ".")),
    children7To14: Number(String(context.kids7To14)?.replace(",", ".")),
    children15To18: Number(String(context.kids15To18)?.replace(",", ".")),
    childrenAbove18: Number(String(context.kids18Above)?.replace(",", ".")),
    childrenIncome: moneyToCents(context.einkommenKinder) ?? 0,
  });

  return einkommen - miete - zahlungen - unterhalt > calculatedFreibetrag;
};

function anyKinderAnzahlFilled(context: BeratungshilfeVorabcheckContext) {
  return (
    context.kids6Below != undefined ||
    context.kids7To14 != undefined ||
    context.kids15To18 != undefined ||
    context.kids18Above != undefined
  );
}

export const guards = {
  anyKinderAnzahlFilled,
  ...yesNoGuards("rechtsschutzversicherung"),
  ...yesNoGuards("wurdeVerklagt"),
  ...yesNoGuards("klageEingereicht"),
  ...yesNoGuards("hamburgOderBremen"),
  ...yesNoGuards("beratungshilfeBeantragt"),
  ...yesNoGuards("eigeninitiative"),
  staatlicheLeistungenNo: (context: BeratungshilfeVorabcheckContext) =>
    ["buergergeld", "keine"].includes(context.staatlicheLeistungen ?? ""),
  staatlicheLeistungenYes: (context: BeratungshilfeVorabcheckContext) =>
    ["grundsicherung", "asylbewerberleistungen"].includes(
      context.staatlicheLeistungen ?? "",
    ),
  staatlicheLeistungenYesButNoEigeninitiative,
  vermoegenAbove10k,
  vermoegenBelow10kAndBuergergeld,
  vermoegenBelow10k,
  ...yesOrNoGuard("erwerbstaetigkeit"),
  ...yesOrNoGuard("partnerschaft"),
  ...yesNoGuards("partnerschaft"),
  ...yesNoGuards("genauigkeit"),
  ...filledGuard("kinderAnzahlKurz"),
  verfuegbaresEinkommenNoAndTriedFreeActions,
  ...yesNoGuards("verfuegbaresEinkommen"),
  ...yesNoGuards("kinder"),
  ...yesNoGuards("kinderKurz"),
  ...filledGuard("kids6Below"),
  ...filledGuard("einkommenKinder"),
  ...yesNoGuards("unterhalt"),
  ...filledGuard("unterhaltSumme"),
  ...filledGuard("miete"),
  weitereZahlungenSummeIncomeTooHigh,
  weitereZahlungenSummeWithWarnings,
  ...filledGuard("weitereZahlungenSumme"),
};
