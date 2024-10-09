import type { BeratungshilfeVorabcheckContext } from "./context";
import { freibetrag } from "./freibetrag";
import moneyToCents from "../../services/validation/money/moneyToCents";
import { type GenericGuard } from "../guards.server";

export const isIncomeTooHigh: GenericGuard<BeratungshilfeVorabcheckContext> = ({
  context,
}) => {
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
