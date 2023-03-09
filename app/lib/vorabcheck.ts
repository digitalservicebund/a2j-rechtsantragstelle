import { isStepComponentWithSchema, Steps } from "~/components/form/steps";
import { number, z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { YesNoAnswer } from "~/components/form/answers";
import { staatlicheLeistungen } from "~/components/form/steps/hasSozialleistungen";
import { vermoegenOptions } from "~/components/form/steps/vermoegen";
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
    [k in keyof typeof formPages]: k;
  }))();

export type AllowedIDs = keyof typeof formPages;

export const initialStepID = pageIDs.welcome;
const finalStep = pageIDs.sozialleistungsBezug;

type TransitionCondition = (
  ctx: Partial<Record<AllowedIDs, Record<string, any>>>
) => boolean;

interface Transition {
  destination: AllowedIDs;
  condition?: TransitionCondition;
}

type FormFlow = Partial<
  Record<AllowedIDs, AllowedIDs | (AllowedIDs | Transition)[]>
>;

export const formFlow: FormFlow = {
  [pageIDs.welcome]: pageIDs.hamburgOderBremen,
  [pageIDs.hamburgOderBremen]: [
    {
      destination: pageIDs.hamburgOderBremenError,
      condition: (context) =>
        context.hamburgOderBremen !== undefined &&
        context.hamburgOderBremen[
          formPages.hamburgOderBremen.varNames.isHamburgOderBremen
        ] === YesNoAnswer.Enum.yes,
    },
    pageIDs.rechtschutzversicherung,
  ],

  [pageIDs.rechtschutzversicherung]: [
    {
      destination: pageIDs.rechtschutzversicherungError,
      condition: (context) =>
        context.rechtschutzversicherung !== undefined &&
        context.rechtschutzversicherung[
          formPages.rechtschutzversicherung.varNames.hasRechtschutzversicherung
        ] === YesNoAnswer.Enum.yes,
    },
    pageIDs.wurdeVerklagt,
  ],
  [pageIDs.wurdeVerklagt]: [
    {
      destination: pageIDs.klageEingereichtError,
      condition: (context) =>
        context.klageEingereicht !== undefined &&
        context.klageEingereicht[
          formPages.klageEingereicht.varNames.hasKlageEingereicht
        ] === YesNoAnswer.Enum.yes,
    },
    pageIDs.klageEingereicht,
  ],
  [pageIDs.klageEingereicht]: [
    {
      destination: pageIDs.klageEingereichtError,
      condition: (context) =>
        context.klageEingereicht !== undefined &&
        context.klageEingereicht[
          formPages.klageEingereicht.varNames.hasKlageEingereicht
        ] === YesNoAnswer.Enum.yes,
    },
    pageIDs.beratungsHilfeBeantragt,
  ],
  [pageIDs.beratungsHilfeBeantragt]: [
    {
      destination: pageIDs.beratungsHilfeBeantragtError,
      condition: (context) =>
        context.beratungsHilfeBeantragt !== undefined &&
        context.beratungsHilfeBeantragt[
          formPages.beratungsHilfeBeantragt.varNames.hasBeratungshilfeBeantragt
        ] === YesNoAnswer.Enum.yes,
    },
    pageIDs.sozialleistungsBezug,
  ],
  [pageIDs.sozialleistungsBezug]: [
    {
      destination: pageIDs.erfolgLeistungsbezug,
      condition: (ctx) =>
        ctx.sozialleistungsBezug !== undefined &&
        (ctx.sozialleistungsBezug[
          formPages.sozialleistungsBezug.varNames.beziehtStaatlicheLeistungen
        ] === staatlicheLeistungen.Enum.Grundsicherung ||
          ctx.sozialleistungsBezug[
            formPages.sozialleistungsBezug.varNames.beziehtStaatlicheLeistungen
          ] === staatlicheLeistungen.Enum.Asylbewerberleistungen),
    },
    pageIDs.vermoegen,
  ],
  [pageIDs.vermoegen]: [
    {
      destination: pageIDs.exitVermoegen,
      condition: (ctx) =>
        ctx.vermoegen !== undefined &&
        ctx.vermoegen[formPages.vermoegen.varNames.vermoegen] ===
          vermoegenOptions.Enum.above_10k,
    },
    {
      destination: pageIDs.exitVermoegenUnknown,
      condition: (ctx) =>
        ctx.vermoegen !== undefined &&
        ctx.vermoegen[formPages.vermoegen.varNames.vermoegen] ===
          vermoegenOptions.Enum.unknown,
    },
    {
      destination: pageIDs.erfolgBuergergeld,
      condition: (ctx) =>
        ctx.vermoegen !== undefined &&
        ctx.sozialleistungsBezug !== undefined &&
        ctx.vermoegen[formPages.vermoegen.varNames.vermoegen] ===
          vermoegenOptions.Enum.below_10k &&
        ctx.sozialleistungsBezug[
          formPages.sozialleistungsBezug.varNames.beziehtStaatlicheLeistungen
        ] === staatlicheLeistungen.Enum.Bürgergeld,
    },
    pageIDs.kinder,
  ],
  [pageIDs.kinder]: pageIDs.erwaerbstaetigkeit,
  [pageIDs.erwaerbstaetigkeit]: pageIDs.familienstand,
  [pageIDs.familienstand]: [
    {
      destination: pageIDs.einkommenPartnerschaft,
      condition: (ctx) =>
        ctx.familienstand !== undefined &&
        ctx.familienstand[formPages.familienstand.varNames.partnerschaft] ===
          YesNoAnswer.Enum.yes,
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
        const einkommen: number =
          ctx.einkommenSingle[
            formPages.einkommenSingle.varNames.einkommenSingle
          ];

        const isErwaerbstaetig: boolean =
          ctx.erwaerbstaetigkeit[
            formPages.erwaerbstaetigkeit.varNames.isErwaerbstaetig
          ] === YesNoAnswer.Enum.yes;

        return (
          einkommen <=
          freibetrag(
            isErwaerbstaetig,
            false,
            ctx.kinder[formPages.kinder.varNames.kids6Below],
            ctx.kinder[formPages.kinder.varNames.kids7To14],
            ctx.kinder[formPages.kinder.varNames.kids15To18],
            ctx.kinder[formPages.kinder.varNames.kids18Above]
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
        const einkommen: number =
          ctx.einkommenPartnerschaft[
            formPages.einkommenPartnerschaft.varNames.einkommenFamilie
          ];

        const isErwaerbstaetig: boolean =
          ctx.erwaerbstaetigkeit[
            formPages.erwaerbstaetigkeit.varNames.isErwaerbstaetig
          ] === YesNoAnswer.Enum.yes;

        return (
          einkommen <=
          freibetrag(
            isErwaerbstaetig,
            true,
            ctx.kinder[formPages.kinder.varNames.kids6Below],
            ctx.kinder[formPages.kinder.varNames.kids7To14],
            ctx.kinder[formPages.kinder.varNames.kids15To18],
            ctx.kinder[formPages.kinder.varNames.kids18Above]
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

// console.log(`stepCount: ${stepCount}`);
// console.log(`backTrace: ${JSON.stringify(backTrace, null, "\n")}`);

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    isStepComponentWithSchema(step)
      ? withZod(step.schema)
      : withZod(z.object({})),
  ])
);
