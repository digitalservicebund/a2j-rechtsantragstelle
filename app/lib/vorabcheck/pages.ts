import type { StepInterface } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { kinderAnzahlSimpleStep } from "~/components/form/steps/kinderAnzahlSimple";
import { verfuegbaresEinkommenStep } from "~/components/form/steps/verfuegbaresEinkommen";
import { staatlicheLeistungenStep } from "~/components/form/steps/staatlicheLeistungen";
import { vermoegenStep } from "~/components/form/steps/vermoegen";
import { kinderAnzahlStep } from "~/components/form/steps/kinderAnzahl";
import { emptyStep } from "~/components/form/steps/emptyStep";
import { moneyInputStep, yesNoStep } from "~/components/form/createStep";

export const formPages: Record<string, StepInterface> = {
  rechtsschutzversicherung: yesNoStep("hasRechtsschutzversicherung"),
  rechtsschutzversicherungError: emptyStep,
  klageEingereicht: yesNoStep("hasKlageEingereicht"),
  klageEingereichtError: emptyStep,
  hamburgOderBremen: yesNoStep("isHamburgOderBremen"),
  hamburgOderBremenError: emptyStep,
  beratungshilfeBeantragt: yesNoStep("hasBeratungshilfeBeantragt"),
  beratungshilfeBeantragtError: emptyStep,
  eigeninitiative: yesNoStep("hasHelpedThemselves"),
  eigeninitiativeWarnung: emptyStep,
  kostenfreieBeratung: yesNoStep("hasTriedFreeServices"),
  kostenfreieBeratungWarnung: emptyStep,
  wurdeVerklagt: yesNoStep("wurdeVerklagt"),
  wurdeVerklagtError: emptyStep,
  staatlicheLeistungen: staatlicheLeistungenStep,
  staatlicheLeistungenAbschlussJa: emptyStep,
  vermoegen: vermoegenStep,
  vermoegenAbschlussJa: emptyStep,
  vermoegenError: emptyStep,
  genauigkeit: yesNoStep("wantsToKnowPrecisely"),
  partnerschaft: yesNoStep("partnerschaft"),
  einkommenPartner: moneyInputStep("einkommenPartner"),
  kinder: yesNoStep("isPayingForKids"),
  kinderAnzahl: kinderAnzahlStep,
  kinderKurz: yesNoStep("isPayingForKids"),
  kinderAnzahlKurz: kinderAnzahlSimpleStep,
  einkommenKinder: moneyInputStep("einkommenKinder"),
  unterhalt: yesNoStep("isPayingUnterhalt"),
  unterhaltSumme: moneyInputStep("unterhalt"),
  erwerbstaetigkeit: yesNoStep("isErwerbstaetig"),
  einkommen: moneyInputStep("einkommen"),
  verfuegbaresEinkommen: verfuegbaresEinkommenStep,
  verfuegbaresEinkommenAbschlussNein: emptyStep,
  verfuegbaresEinkommenAbschlussVielleicht: emptyStep,
  verfuegbaresEinkommenAbschlussJa: emptyStep,
  miete: moneyInputStep("miete"),
  weitereZahlungen: yesNoStep("hasWeitereZahlungen"),
  weitereZahlungenAbschlussNein: emptyStep,
  weitereZahlungenAbschlussVielleicht: emptyStep,
  weitereZahlungenAbschlussJa: emptyStep,
  weitereZahlungenSumme: moneyInputStep("weitereZahlungenSumme"),
  weitereZahlungenSummeAbschlussNein: emptyStep,
  weitereZahlungenSummeAbschlussVielleicht: emptyStep,
  weitereZahlungenSummeAbschlussJa: emptyStep,
} as const;

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    "schema" in step ? withZod(step.schema) : withZod(z.object({})),
  ])
) as Record<string, ReturnType<typeof withZod>>;
