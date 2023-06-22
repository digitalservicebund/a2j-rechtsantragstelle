import { moneyInputStep, yesNoStep } from "~/models/flows/createStep";
import type { FormPages } from "~/models/flows/FormPages";
import { buildAllValidators } from "~/models/flows/buildAllValidators";
import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

export const formPages: FormPages = {
  rechtsschutzversicherung: yesNoStep("hasRechtsschutzversicherung"),
  rechtsschutzversicherungError: {},
  klageEingereicht: yesNoStep("hasKlageEingereicht"),
  klageEingereichtError: {},
  hamburgOderBremen: yesNoStep("isHamburgOderBremen"),
  hamburgOderBremenError: {},
  beratungshilfeBeantragt: yesNoStep("hasBeratungshilfeBeantragt"),
  beratungshilfeBeantragtError: {},
  eigeninitiative: yesNoStep("hasHelpedThemselves"),
  eigeninitiativeWarnung: {},
  kostenfreieBeratung: yesNoStep("hasTriedFreeServices"),
  kostenfreieBeratungWarnung: {},
  wurdeVerklagt: yesNoStep("wurdeVerklagt"),
  wurdeVerklagtError: {},
  staatlicheLeistungen: {
    schema: z.object({
      staatlicheLeistung: z.enum([
        "grundsicherung",
        "asylbewerberleistungen",
        "buergergeld",
        "keine",
      ]),
    }),
  },
  staatlicheLeistungenAbschlussJa: {},
  vermoegen: {
    schema: z.object({ vermoegen: z.enum(["below_10k", "above_10k"]) }),
  },
  vermoegenAbschlussJa: {},
  vermoegenError: {},
  genauigkeit: yesNoStep("wantsToKnowPrecisely"),
  partnerschaft: yesNoStep("partnerschaft"),
  einkommenPartner: moneyInputStep("einkommenPartner"),
  kinder: yesNoStep("isPayingForKids"),
  kinderAnzahl: {
    schema: z.object({
      kids6Below: buildKidsCountValidationSchema(),
      kids7To14: buildKidsCountValidationSchema(),
      kids15To18: buildKidsCountValidationSchema(),
      kids18Above: buildKidsCountValidationSchema(),
    }),
  },
  kinderKurz: yesNoStep("isPayingForKids"),
  kinderAnzahlKurz: {
    schema: z.object({ kidsTotal: buildKidsCountValidationSchema() }),
  },
  einkommenKinder: moneyInputStep("einkommenKinder"),
  unterhalt: yesNoStep("isPayingUnterhalt"),
  unterhaltSumme: moneyInputStep("unterhalt"),
  erwerbstaetigkeit: yesNoStep("isErwerbstaetig"),
  einkommen: moneyInputStep("einkommen"),
  verfuegbaresEinkommen: yesNoStep("excessiveDisposableIncome"),
  verfuegbaresEinkommenAbschlussNein: {},
  verfuegbaresEinkommenAbschlussVielleicht: {},
  verfuegbaresEinkommenAbschlussJa: {},
  miete: moneyInputStep("miete"),
  weitereZahlungen: yesNoStep("hasWeitereZahlungen"),
  weitereZahlungenAbschlussNein: {},
  weitereZahlungenAbschlussVielleicht: {},
  weitereZahlungenAbschlussJa: {},
  weitereZahlungenSumme: moneyInputStep("weitereZahlungenSumme"),
  weitereZahlungenSummeAbschlussNein: {},
  weitereZahlungenSummeAbschlussVielleicht: {},
  weitereZahlungenSummeAbschlussJa: {},
} as const;

export const allValidators = buildAllValidators(formPages);
