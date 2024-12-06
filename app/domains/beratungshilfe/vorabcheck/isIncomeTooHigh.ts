import type { BeratungshilfeVorabcheckContext } from "./context";
import { calculateFreibetrag } from "./freibetrag";
import moneyToCents from "../../../services/validation/money/moneyToCents";
import { type GenericGuard } from "../../guards.server";

export const isIncomeTooHigh: GenericGuard<BeratungshilfeVorabcheckContext> = ({
  context,
}) => {
  const einkommen = moneyToCents(context.einkommen) ?? 0;
  const miete = moneyToCents(context.miete) ?? 0;
  const zahlungen = moneyToCents(context.weitereZahlungenSumme) ?? 0;
  const unterhalt =
    (context.unterhalt == "yes" && moneyToCents(context.unterhaltSumme)) || 0;

  const calculatedFreibetrag = calculateFreibetrag({
    working: context.erwerbstaetigkeit === "yes",
    partnership: context.partnerschaft === "yes",
    partnerIncome: moneyToCents(context.einkommenPartner) ?? 0,
    childrenBelow6: Number(context.kids?.kids6Below),
    children7To14: Number(context.kids?.kids7To14),
    children15To18: Number(context.kids?.kids15To18),
    childrenAbove18: Number(context.kids?.kids18Above),
    childrenIncome: moneyToCents(context.einkommenKinder) ?? 0,
  });

  return einkommen - miete - zahlungen - unterhalt > calculatedFreibetrag;
};
