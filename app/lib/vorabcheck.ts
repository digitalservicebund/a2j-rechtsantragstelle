import { isStepComponentWithSchema, Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { freibetrag } from "./freibetrag";

export const formPages = {
  welcome: Steps.welcomeStep,
  rechtschutzversicherung: Steps.rechtSchutzVersicherungStep,
  rechtschutzversicherungError: Steps.exitRechtschutzversicherungStep,
  klageEingereicht: Steps.klageEingereichtStep,
  klageEingereichtError: Steps.exitKlageEingereicht,
  hamburgOderBremen: Steps.hamburgOderBremenStep,
  hamburgOderBremenError: Steps.exitHamburgOrBremen,
  beratungsHilfeBeantragt: Steps.beratungshilfeBeantragtStep,
  beratungsHilfeBeantragtError: Steps.exitBeratungshilfeBeantragt,
  wurdeVerklagt: Steps.wurdeVerklagtStep,
  sozialleistungsBezug: Steps.sozialleistungStep,
  vermoegen: Steps.vermoegenStep,
  erfolgLeistungsbezug: Steps.successLeistungStep,
  exitVermoegen: Steps.exitVermoegenStep,
  exitVermoegenUnknown: Steps.exitVermoegenUnknownStep,
  familienstand: Steps.familienstandStep,
  erfolgBuergergeld: Steps.successBuergergeldStep,
  kinder: Steps.kidsCountStep,
  erwaerbstaetigkeit: Steps.erwaerbstaetigStep,
  einkommenSingle: Steps.einkommenSingleStep,
  einkommenPartnerschaft: Steps.einkommenPartnerStep,
  einkommenZuHoch: Steps.exitFreibetrag,
  erfolg: Steps.successFreibetrag,
} as const;

type FormPages = typeof formPages;
export type AllowedIDs = keyof FormPages;

// Construct object of formPages keys (eg formPages.welcome), see https://stackoverflow.com/a/70811604
const pageIDs = (() =>
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

export const initialStepID = pageIDs.welcome;
const finalStep = pageIDs.sozialleistungsBezug;

// Type Context by infering all zod schemas (and dropping pageIDs without schema)
type Context = Partial<{
  [T in AllowedIDs]: FormPages[T] extends { schema: any }
    ? z.infer<FormPages[T]["schema"]>
    : never;
}>;

interface Transition {
  destination: AllowedIDs;
  condition?: (ctx: Context) => boolean;
}

type FormFlow = Partial<
  Record<AllowedIDs, AllowedIDs | (AllowedIDs | Transition)[]>
>;

// form flow is a mapping of pageID to:
// pageID: trivial transition (always taken)
// [Transition | pageID]: takes first valid transition.condition or trivial transition (pageID)

export const formFlow: FormFlow = {
  [pageIDs.welcome]: pageIDs.hamburgOderBremen,
  [pageIDs.hamburgOderBremen]: [
    {
      destination: pageIDs.hamburgOderBremenError,
      condition: (context) =>
        context.hamburgOderBremen?.isHamburgOderBremen === "yes",
    },
    pageIDs.rechtschutzversicherung,
  ],

  [pageIDs.rechtschutzversicherung]: [
    {
      destination: pageIDs.rechtschutzversicherungError,
      condition: (context) =>
        context.rechtschutzversicherung?.hasRechtschutzversicherung === "yes",
    },
    pageIDs.wurdeVerklagt,
  ],
  [pageIDs.wurdeVerklagt]: [
    {
      destination: pageIDs.klageEingereichtError,
      condition: (context) => context.wurdeVerklagt?.wurdeVerklagt === "yes",
    },
    pageIDs.klageEingereicht,
  ],
  [pageIDs.klageEingereicht]: [
    {
      destination: pageIDs.klageEingereichtError,
      condition: (context) =>
        context.klageEingereicht?.hasKlageEingereicht === "yes",
    },
    pageIDs.beratungsHilfeBeantragt,
  ],
  [pageIDs.beratungsHilfeBeantragt]: [
    {
      destination: pageIDs.beratungsHilfeBeantragtError,
      condition: (context) =>
        context.beratungsHilfeBeantragt?.hasBeratungshilfeBeantragt === "yes",
    },
    pageIDs.sozialleistungsBezug,
  ],
  [pageIDs.sozialleistungsBezug]: [
    {
      destination: pageIDs.erfolgLeistungsbezug,
      condition: (ctx) =>
        ctx.sozialleistungsBezug?.beziehtStaatlicheLeistungen ===
          "Grundsicherung" ||
        ctx.sozialleistungsBezug?.beziehtStaatlicheLeistungen ===
          "Asylbewerberleistungen",
    },
    pageIDs.vermoegen,
  ],
  [pageIDs.vermoegen]: [
    {
      destination: pageIDs.exitVermoegen,
      condition: (ctx) => ctx.vermoegen?.vermoegen === "above_10k",
    },
    {
      destination: pageIDs.exitVermoegenUnknown,
      condition: (ctx) => ctx.vermoegen?.vermoegen === "unknown",
    },
    {
      destination: pageIDs.erfolgBuergergeld,
      condition: (ctx) =>
        ctx.vermoegen?.vermoegen === "below_10k" &&
        ctx.sozialleistungsBezug?.beziehtStaatlicheLeistungen === "Bürgergeld",
    },
    pageIDs.kinder,
  ],
  [pageIDs.kinder]: pageIDs.erwaerbstaetigkeit,
  [pageIDs.erwaerbstaetigkeit]: pageIDs.familienstand,
  [pageIDs.familienstand]: [
    {
      destination: pageIDs.einkommenPartnerschaft,
      condition: (ctx) => ctx.familienstand?.partnerschaft === "yes",
    },
    pageIDs.einkommenSingle,
  ],
  [pageIDs.einkommenSingle]: [
    {
      destination: pageIDs.erfolg,
      condition: (ctx) => {
        if (!ctx.einkommenSingle || !ctx.erwaerbstaetigkeit || !ctx.kinder) {
          return false;
        }
        const einkommen = ctx.einkommenSingle.einkommenSingle;
        const isErwaerbstaetig =
          ctx.erwaerbstaetigkeit.isErwaerbstaetig === "yes";

        return (
          einkommen <=
          freibetrag(
            isErwaerbstaetig,
            false,
            ctx.kinder.kids6Below,
            ctx.kinder.kids7To14,
            ctx.kinder.kids15To18,
            ctx.kinder.kids18Above
          )
        );
      },
    },
    pageIDs.einkommenZuHoch,
  ],
  [pageIDs.einkommenPartnerschaft]: [
    {
      destination: pageIDs.erfolg,
      condition: (ctx) => {
        if (
          !ctx.einkommenPartnerschaft ||
          !ctx.erwaerbstaetigkeit ||
          !ctx.kinder
        ) {
          return false;
        }
        const einkommen = ctx.einkommenPartnerschaft.einkommenFamilie;

        const isErwaerbstaetig =
          ctx.erwaerbstaetigkeit.isErwaerbstaetig === "yes";

        return (
          einkommen <=
          freibetrag(
            isErwaerbstaetig,
            true,
            ctx.kinder.kids6Below,
            ctx.kinder.kids7To14,
            ctx.kinder.kids15To18,
            ctx.kinder.kids18Above
          )
        );
      },
    },
    pageIDs.einkommenZuHoch,
  ],
};

// Build back-propagation from formFlow
export const backTrace: Partial<Record<AllowedIDs, AllowedIDs>> = {};
for (const [key, value] of Object.entries(formFlow)) {
  const pageID = key as AllowedIDs;
  if (typeof value === "string") {
    // 1. If direct transition: add entry
    backTrace[value] = pageID;
  } else {
    // 2. If transition array
    value.forEach((stepDecision) => {
      if (typeof stepDecision === "string") {
        // 2a. add entries for direct transitions
        backTrace[stepDecision] = pageID;
      } else {
        // 2b. add entries for conditional transition
        backTrace[stepDecision.destination] = pageID;
      }
    });
  }
}

let stepCount: number | null = 0;
let currentstep: AllowedIDs = finalStep;
const maxStepCount = 100;

while (currentstep !== initialStepID || stepCount >= maxStepCount) {
  if (!backTrace[currentstep]) {
    stepCount = null;
    break;
  }
  currentstep = backTrace[currentstep] as AllowedIDs;
  stepCount += 1;
}

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    isStepComponentWithSchema(step)
      ? withZod(step.schema)
      : withZod(z.object({})),
  ])
);
