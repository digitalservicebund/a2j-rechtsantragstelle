import { freibetrag } from "~/lib/freibetrag";
import moneyToCents from "../validation/money/moneyToCents";

type Context = Record<string, any>;

type Guard = (context: Context) => boolean;

const yesNoGuards = (step: string, field?: string): Record<string, Guard> => ({
  [`${step}Yes`]: (context) => context?.[step]?.[field ?? step] === "yes",
  [`${step}No`]: (context) => context?.[step]?.[field ?? step] === "no",
});

const yesOrNoGuard = (step: string, field?: string): Record<string, Guard> => ({
  [`${step}YesOrNo`]: (context) =>
    ["yes", "no"].includes(context?.[step]?.[field ?? step]),
});

const filledGuard = (step: string, field?: string): Record<string, Guard> => ({
  [`${step}Filled`]: (context) =>
    ![null, undefined].includes(context?.[step]?.[field ?? step]),
});

const staatlicheLeistungenYes: Guard = (context) =>
  ["grundsicherung", "asylbewerberleistungen"].includes(
    context?.staatlicheLeistungen?.staatlicheLeistung
  );

const staatlicheLeistungenNo: Guard = (context) =>
  ["buergergeld", "keine"].includes(
    context?.staatlicheLeistungen?.staatlicheLeistung
  );

const vermoegenAbove10k: Guard = (context) =>
  context["vermoegen"]?.vermoegen === "above_10k";
const vermoegenBelow10k: Guard = (context) =>
  context["vermoegen"]?.vermoegen === "below_10k";
const vermoegenBelow10kAndBuergergeld: Guard = (context) =>
  context["vermoegen"]?.vermoegen === "below_10k" &&
  context["staatlicheLeistungen"]?.staatlicheLeistung === "buergergeld";

const verfuegbaresEinkommenNoAndTriedFreeActions: Guard = (context) =>
  context?.verfuegbaresEinkommen?.excessiveDisposableIncome === "no" &&
  !anyNonCriticalWarning(context);

const weitereZahlungenNoAndIncomeTooHigh: Guard = (context) =>
  context?.weitereZahlungen?.hasWeitereZahlungen === "no" &&
  isIncomeTooHigh(context);

const weitereZahlungenNoAndIncomeNotTooHigh: Guard = (context) =>
  context?.weitereZahlungen?.hasWeitereZahlungen === "no" &&
  !isIncomeTooHigh(context);

const weitereZahlungenSummeIncomeTooHigh: Guard = (context) =>
  isIncomeTooHigh(context);

const weitereZahlungenSummeIncomeNotTooHigh: Guard = (context) =>
  !isIncomeTooHigh(context);

const einkommenFixme: Guard = () => false;

const anyNonCriticalWarning = (context: Context) => {
  return (
    context["kostenfreieBeratung"]?.hasTriedFreeServices == "no" ||
    context["eigeninitiative"]?.hasHelpedThemselves == "no"
  );
};

export const isIncomeTooHigh = (context: any) => {
  const einkommen = context.einkommen?.einkommen
    ? moneyToCents(context.einkommen.einkommen)
    : 0;
  const miete = context.miete?.miete ? moneyToCents(context.miete.miete) : 0;
  const zahlungen =
    context.weitereZahlungen?.weitereZahlungen == "no" &&
    context.weitereZahlungenSumme?.weitereZahlungenSumme
      ? moneyToCents(context.weitereZahlungenSumme.weitereZahlungenSumme)
      : 0;
  const unterhalt =
    context.unterhalt?.isPayingUnterhalt == "yes" &&
    context.unterhaltSumme?.unterhalt
      ? moneyToCents(context.unterhaltSumme.unterhalt)
      : 0;
  return (
    einkommen - miete - zahlungen - unterhalt >
    freibetrag({
      working: context.erwerbstaetigkeit?.isErwerbstaetig === "yes",
      partnership: context.partnerschaft?.partnerschaft === "yes",
      partnerIncome: context.einkommenPartner?.einkommenPartner
        ? moneyToCents(context.einkommenPartner.einkommenPartner)
        : 0,
      childrenBelow6: Number(
        String(context.kinderAnzahl?.kids6Below)?.replace(",", ".")
      ),
      children7To14: Number(
        String(context.kinderAnzahl?.kids7To14)?.replace(",", ".")
      ),
      children15To18: Number(
        String(context.kinderAnzahl?.kids15To18)?.replace(",", ".")
      ),
      childrenAbove18: Number(
        String(context.kinderAnzahl?.kids18Above)?.replace(",", ".")
      ),
      childrenIncome: context.einkommenKinder?.einkommenKinder
        ? moneyToCents(context.einkommenKinder.einkommenKinder)
        : 0,
    })
  );
};

const isPayingForKids: Guard = (context) => {
  return context["kinderKurz"]?.isPayingForKids === "yes";
};

export const guards = {
  isPayingForKids,
  ...yesNoGuards("rechtsschutzversicherung", "hasRechtsschutzversicherung"),
  ...yesNoGuards("wurdeVerklagt"),
  ...yesNoGuards("klageEingereicht", "hasKlageEingereicht"),
  ...yesNoGuards("hamburgOderBremen", "isHamburgOderBremen"),
  ...yesNoGuards("beratungshilfeBeantragt", "hasBeratungshilfeBeantragt"),
  ...yesNoGuards("eigeninitiative", "hasHelpedThemselves"),
  ...yesNoGuards("kostenfreieBeratung", "hasTriedFreeServices"),
  staatlicheLeistungenYes,
  staatlicheLeistungenNo,
  vermoegenAbove10k,
  vermoegenBelow10kAndBuergergeld,
  vermoegenBelow10k,
  ...yesOrNoGuard("erwerbstaetigkeit", "isErwerbstaetig"),
  ...yesOrNoGuard("partnerschaft"),
  ...yesNoGuards("genauigkeit", "wantsToKnowPrecisely"),
  ...yesNoGuards("kinderKurz", "isPayingForKids"),
  ...filledGuard("kinderAnzahlKurz", "kidsTotal"),
  verfuegbaresEinkommenNoAndTriedFreeActions,
  ...yesNoGuards("verfuegbaresEinkommen", "excessiveDisposableIncome"),
  ...yesNoGuards("kinder", "isPayingForKids"),
  ...filledGuard("kinderAnzahl", "kids6Below"),
  ...filledGuard("einkommenKinder"),
  ...yesNoGuards("unterhalt", "isPayingUnterhalt"),
  ...filledGuard("unterhaltSumme", "unterhalt"),
  ...filledGuard("miete"),
  ...yesNoGuards("weitereZahlungen", "hasWeitereZahlungen"),
  weitereZahlungenNoAndIncomeTooHigh,
  weitereZahlungenNoAndIncomeNotTooHigh,
  weitereZahlungenSummeIncomeTooHigh,
  weitereZahlungenSummeIncomeNotTooHigh,
  ...filledGuard("weitereZahlungenSumme"),
  einkommenFixme,
};
