import { freibetrag } from "~/lib/freibetrag";
import moneyToCents from "../validation/money/moneyToCents";

function searchEntryInSession(
  context: any,
  stepId: any,
  value: string
): boolean {
  let found = false;
  const values = context[stepId];
  if (values !== undefined) {
    const propertyValues = Object.values(values);
    for (const entry in propertyValues) {
      if (propertyValues[entry] === value) {
        found = true;
        break;
      }
    }
  }

  return found;
}

export default function getGuards(stepId: string, context: any) {
  return {
    yes: () => searchEntryInSession(context, stepId, "yes"),
    no: () => searchEntryInSession(context, stepId, "no"),
    staatlicheLeistung: () =>
      context.staatlicheLeistungen?.staatlicheLeistung === "grundsicherung" ||
      context.staatlicheLeistungen?.staatlicheLeistung ===
        "asylbewerberleistungen",
    above_10k: () => context.vermoegen?.vermoegen === "above_10k",
    below_10k: () =>
      context.vermoegen?.vermoegen === "below_10k" &&
      context.staatlicheLeistungen?.staatlicheLeistung === "buergergeld",
    nonCriticalVerfuegbaresEinkommen: () =>
      !anyNonCriticalWarning(context) &&
      searchEntryInSession(context, stepId, "no"),
    verfuegbaresEinkommen: () =>
      anyNonCriticalWarning(context) &&
      searchEntryInSession(context, stepId, "no"),
    incomeTooHigh: () => isIncomeTooHigh(context),
    nonCritical: () =>
      anyNonCriticalWarning(context) && !isIncomeTooHigh(context),
  };
}

function anyNonCriticalWarning(context: any) {
  return (
    context.kostenfreieBeratung?.hasTriedFreeServices == "no" ||
    context.eigeninitiative?.hasHelpedThemselves == "no"
  );
}

export function isIncomeTooHigh(context: any) {
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
}
