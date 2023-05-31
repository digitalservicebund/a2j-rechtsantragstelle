import { freibetrag } from "~/lib/freibetrag";
import moneyToCents from "../validation/money/moneyToCents";

function searchEntryInSession(
  context: Record<string, any>,
  stepID: string,
  expectedValue: string
): boolean {
  // TODO this will not work if you have more than one field with the same possible answers
  const stepProperties = context[stepID];
  return Object.values(stepProperties).some((entry) => entry == expectedValue);
}

interface Context extends Record<string, any> {
  stepId: string;
}

type Guard = (context: Context) => boolean;

const yes: Guard = (context) => {
  return searchEntryInSession(context, context.stepId, "yes");
};

const no: Guard = (context) => {
  return searchEntryInSession(context, context.stepId, "no");
};

const anyNonCriticalWarning: Guard = (context) => {
  return (
    context["kostenfreieBeratung"]?.hasTriedFreeServices == "no" ||
    context["eigeninitiative"]?.hasHelpedThemselves == "no"
  );
};

const staatlicheLeistung: Guard = (context) => {
  return (
    context["staatlicheLeistungen"]?.staatlicheLeistung === "grundsicherung" ||
    context["staatlicheLeistungen"]?.staatlicheLeistung ===
      "asylbewerberleistungen"
  );
};

const above_10k: Guard = (context) =>
  context["vermoegen"]?.vermoegen === "above_10k";
const below_10k: Guard = (context) =>
  context["vermoegen"]?.vermoegen === "below_10k" &&
  context["staatlicheLeistungen"]?.staatlicheLeistung === "buergergeld";

const nonCriticalVerfuegbaresEinkommen: Guard = (context) =>
  !anyNonCriticalWarning(context) &&
  searchEntryInSession(context, context.stepId, "no");

const verfuegbaresEinkommen: Guard = (context) =>
  anyNonCriticalWarning(context) &&
  searchEntryInSession(context, context.stepId, "no");

const incomeTooHigh: Guard = (context) => isIncomeTooHigh(context);
const nonCritical: Guard = (context) =>
  anyNonCriticalWarning(context) && !isIncomeTooHigh(context);

export const isIncomeTooHigh = (context: any) => {
  return (
    (context.einkommen?.einkommen
      ? moneyToCents(context.einkommen.einkommen)
      : 0) -
      (context.miete?.miete ? moneyToCents(context.miete.miete) : 0) -
      (context.weitereZahlungenSumme?.weitereZahlungenSumme
        ? moneyToCents(context.weitereZahlungenSumme.weitereZahlungenSumme)
        : 0) -
      (context.unterhaltSumme?.unterhalt
        ? moneyToCents(context.unterhaltSumme.unterhalt)
        : 0) >
    freibetrag(
      context.erwerbstaetigkeit?.isErwerbstaetig === "yes",
      context.partnerschaft?.partnerschaft === "yes",
      context.einkommenPartner?.einkommenPartner
        ? moneyToCents(context.einkommenPartner.einkommenPartner)
        : 0,
      Number(String(context.kinderAnzahl?.kids6Below)?.replace(",", ".")),
      Number(String(context.kinderAnzahl?.kids7To14)?.replace(",", ".")),
      Number(String(context.kinderAnzahl?.kids15To18)?.replace(",", ".")),
      Number(String(context.kinderAnzahl?.kids18Above)?.replace(",", ".")),
      context.einkommenKinder?.einkommenKinder
        ? moneyToCents(context.einkommenKinder.einkommenKinder)
        : 0
    )
  );
};

export const guards = {
  yes,
  no,
  anyNonCriticalWarning,
  staatlicheLeistung,
  above_10k,
  below_10k,
  nonCriticalVerfuegbaresEinkommen,
  verfuegbaresEinkommen,
  incomeTooHigh,
  nonCritical,
};
