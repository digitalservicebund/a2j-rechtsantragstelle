import type { BeratungshilfeVorabcheckContext } from "./context";
import { freibetrag } from "./freibetrag";
import moneyToCents from "../../services/validation/money/moneyToCents";
import { yesNoGuards, type Guards, type GenericGuard } from "../guards.server";

type Guard = GenericGuard<BeratungshilfeVorabcheckContext>;

const yesOrNoGuard = (
  field: keyof BeratungshilfeVorabcheckContext,
): Guards => ({
  [`${field}YesOrNo`]: ({ context }) =>
    context[field] === "yes" || context[field] === "no",
});

const filledGuard = (field: keyof BeratungshilfeVorabcheckContext): Guards => ({
  [`${field}Filled`]: ({ context }) =>
    context[field] !== undefined || context[field] !== null,
});

const staatlicheLeistungenYesButNoEigeninitiative: Guard = ({ context }) => {
  return (
    guards.staatlicheLeistungenYes({ context }) &&
    context.eigeninitiative == "no"
  );
};

const vermoegenAbove10k: Guard = ({ context }) =>
  context.vermoegen === "above_10k";
const vermoegenBelow10k: Guard = ({ context }) =>
  context.vermoegen === "below_10k";
const vermoegenBelow10kAndBuergergeld: Guard = ({ context }) =>
  context.vermoegen === "below_10k" &&
  context.staatlicheLeistungen === "buergergeld";

const vermoegenBelow10kAndBuergergeldButNoEigeninitiative: Guard = ({
  context,
}) => {
  return (
    vermoegenBelow10kAndBuergergeld({ context }) &&
    context.eigeninitiative == "no"
  );
};

const verfuegbaresEinkommenNoAndTriedFreeActions: Guard = ({ context }) =>
  context.verfuegbaresEinkommen === "no" && !anyNonCriticalWarning({ context });

const weitereZahlungenSummeIncomeTooHigh: Guard = ({ context }) =>
  isIncomeTooHigh({ context });

const weitereZahlungenSummeWithWarnings: Guard = ({ context }) =>
  !isIncomeTooHigh({ context }) && anyNonCriticalWarning({ context });

const anyNonCriticalWarning: Guard = ({ context }) => {
  return context.eigeninitiative == "no";
};

export const isIncomeTooHigh: Guard = ({ context }) => {
  const einkommen = moneyToCents(context.einkommen) ?? 0;
  const miete = moneyToCents(context.miete) ?? 0;
  const zahlungen = moneyToCents(context.weitereZahlungenSumme) ?? 0;
  const unterhalt =
    (context.unterhalt == "yes" && moneyToCents(context.unterhaltSumme)) || 0;

  const calculatedFreibetrag = freibetrag({
    working: context.erwerbstaetigkeit === "yes",
    partnership: context.partnerschaft === "yes",
    partnerIncome: moneyToCents(context.einkommenPartner) ?? 0,
    childrenBelow6: Number(String(context.kids?.kids6Below)?.replace(",", ".")),
    children7To14: Number(String(context.kids?.kids7To14)?.replace(",", ".")),
    children15To18: Number(String(context.kids?.kids15To18)?.replace(",", ".")),
    childrenAbove18: Number(
      String(context.kids?.kids18Above)?.replace(",", "."),
    ),
    childrenIncome: moneyToCents(context.einkommenKinder) ?? 0,
  });

  return einkommen - miete - zahlungen - unterhalt > calculatedFreibetrag;
};

const anyKinderAnzahlFilled: Guard = ({ context }) =>
  context.kids?.kids6Below != undefined ||
  context.kids?.kids7To14 != undefined ||
  context.kids?.kids15To18 != undefined ||
  context.kids?.kids18Above != undefined;

export const guards = {
  anyKinderAnzahlFilled,
  ...yesNoGuards("beratungshilfeBeantragt"),
  ...yesNoGuards("eigeninitiative"),
  staatlicheLeistungenNo: ({ context }) =>
    ["buergergeld", "keine"].includes(context.staatlicheLeistungen ?? ""),
  staatlicheLeistungenYes: ({ context }) =>
    ["grundsicherung", "asylbewerberleistungen"].includes(
      context.staatlicheLeistungen ?? "",
    ),
  staatlicheLeistungenYesButNoEigeninitiative,
  vermoegenAbove10k,
  vermoegenBelow10kAndBuergergeld,
  vermoegenBelow10kAndBuergergeldButNoEigeninitiative,
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
  ...filledGuard("einkommenKinder"),
  ...yesNoGuards("unterhalt"),
  ...filledGuard("unterhaltSumme"),
  ...filledGuard("miete"),
  weitereZahlungenSummeIncomeTooHigh,
  weitereZahlungenSummeWithWarnings,
  ...filledGuard("weitereZahlungenSumme"),
} satisfies Guards<BeratungshilfeVorabcheckContext>;
