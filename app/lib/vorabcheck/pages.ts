import { Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";

export const formPages = {
  rechtsschutzversicherung: Steps.rechtsschutzversicherungStep,
  rechtsschutzversicherungError: Steps.exitRechtsschutzversicherungStep,
  klageEingereicht: Steps.klageEingereichtStep,
  klageEingereichtError: Steps.exitKlageEingereicht,
  hamburgOderBremen: Steps.hamburgOderBremenStep,
  hamburgOderBremenError: Steps.emptyStep,
  beratungshilfeBeantragt: Steps.beratungshilfeBeantragtStep,
  beratungshilfeBeantragtError: Steps.emptyStep,
  eigeninitiative: Steps.eigeninitiativeStep,
  eigeninitiativeWarnung: Steps.emptyStep,
  kostenfreieBeratung: Steps.kostenfreieBeratungStep,
  kostenfreieBeratungWarnung: Steps.emptyStep,
  wurdeVerklagt: Steps.wurdeVerklagtStep,
  staatlicheLeistungen: Steps.staatlicheLeistungenStep,
  vermoegen: Steps.vermoegenStep,
  erfolgLeistungsbezug: Steps.emptyStep,
  vermoegenError: Steps.emptyStep,
  partnerschaft: Steps.partnerschaftStep,
  erfolgBuergergeld: Steps.successBuergergeldStep,
  kinder: Steps.kinderStep,
  kinderAnzahl: Steps.kinderAnzahlStep,
  unterhalt: Steps.unterhaltStep,
  unterhaltSumme: Steps.unterhaltSummeStep,
  erwerbstaetigkeit: Steps.erwerbstaetigkeitStep,
  einkommen: Steps.einkommenStep,
  einkommenZuHoch: Steps.exitFreibetrag,
  erfolg: Steps.successFreibetrag,
} as const;

export type FormPages = typeof formPages;
export type AllowedIDs = keyof FormPages;

// Construct object of formPages keys (eg formPages.welcome), see https://stackoverflow.com/a/70811604
export const pageIDs = (() =>
  ({
    ...Object.keys(formPages)
      .filter((k) => isNaN(Number(k)))
      .reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: cur,
        }),
        {}
      ),
  } as {
    [k in AllowedIDs]: k;
  }))();

export const initialStepID = pageIDs.rechtsschutzversicherung;
export const finalStep = pageIDs.erfolg;

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    "schema" in step ? withZod(step.schema) : withZod(z.object({})),
  ])
) as Record<AllowedIDs, ReturnType<typeof withZod>>;
