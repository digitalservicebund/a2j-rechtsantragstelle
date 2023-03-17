import { isStepComponentWithSchema, Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { freibetrag } from "./freibetrag";
import { makeFormGraph, makePathFinder } from "./treeCalculations";

export const formPages = {
  rechtschutzversicherung: Steps.rechtSchutzVersicherungStep,
  rechtschutzversicherungError: Steps.exitRechtschutzversicherungStep,
  klageEingereicht: Steps.klageEingereichtStep,
  klageEingereichtError: Steps.exitKlageEingereicht,
  hamburgOderBremen: Steps.hamburgOderBremenStep,
  hamburgOderBremenError: Steps.exitHamburgOrBremen,
  beratungsHilfeBeantragt: Steps.beratungshilfeBeantragtStep,
  beratungsHilfeBeantragtError: Steps.exitBeratungshilfeBeantragt,
  eigeninitiative: Steps.selfHelpStep,
  eigeninitiativeWarnung: Steps.selfHelpWarning,
  kostenfreieBeratung: Steps.freeServicesStep,
  kostenfreieBeratungeWarnung: Steps.freeServicesWarning,
  wurdeVerklagt: Steps.wurdeVerklagtStep,
  sozialleistungsBezug: Steps.sozialleistungStep,
  vermoegen: Steps.vermoegenStep,
  erfolgLeistungsbezug: Steps.successLeistungStep,
  exitVermoegen: Steps.exitVermoegenStep,
  familienstand: Steps.familienstandStep,
  erfolgBuergergeld: Steps.successBuergergeldStep,
  kinder: Steps.kidsStep,
  kinderAnzahl: Steps.kidsCountStep,
  unterhalt: Steps.unterhaltStep,
  unterhaltSumme: Steps.unterhaltAmountStep,
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

export const initialStepID = pageIDs.rechtschutzversicherung;
export const finalStep = pageIDs.erfolg;

// Type Context by infering all zod schemas (and dropping pageIDs without schema)
export type Context = Partial<{
  [T in AllowedIDs]: FormPages[T] extends { schema: any }
    ? z.infer<FormPages[T]["schema"]>
    : never;
}>;

export type ConditionFunction = (ctx: Context) => boolean;
interface Transition {
  destination: AllowedIDs;
  condition?: ConditionFunction;
}

export type FormFlow = Partial<
  Record<AllowedIDs, AllowedIDs | (AllowedIDs | Transition)[]>
>;

// form flow is a mapping of pageID to:
// pageID: trivial transition (always taken)
// [Transition | pageID]: takes first valid transition.condition or trivial transition (pageID)

export const formFlow: FormFlow = {
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
    pageIDs.hamburgOderBremen,
  ],
  [pageIDs.hamburgOderBremen]: [
    {
      destination: pageIDs.hamburgOderBremenError,
      condition: (context) =>
        context.hamburgOderBremen?.isHamburgOderBremen === "yes",
    },
    pageIDs.beratungsHilfeBeantragt,
  ],
  [pageIDs.beratungsHilfeBeantragt]: [
    {
      destination: pageIDs.beratungsHilfeBeantragtError,
      condition: (context) =>
        context.beratungsHilfeBeantragt?.hasBeratungshilfeBeantragt === "yes",
    },
    pageIDs.eigeninitiative,
  ],
  [pageIDs.eigeninitiative]: [
    {
      destination: pageIDs.eigeninitiativeWarnung,
      condition: (context) =>
        context.eigeninitiative?.hasHelpedThemselves === "no",
    },
    pageIDs.kostenfreieBeratung,
  ],
  [pageIDs.eigeninitiativeWarnung]: pageIDs.kostenfreieBeratung,
  [pageIDs.kostenfreieBeratung]: [
    {
      destination: pageIDs.kostenfreieBeratungeWarnung,
      condition: (context) =>
        context.kostenfreieBeratung?.hasTriedFreeServices === "no",
    },
    pageIDs.sozialleistungsBezug,
  ],
  [pageIDs.kostenfreieBeratungeWarnung]: pageIDs.sozialleistungsBezug,
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
      destination: pageIDs.erfolgBuergergeld,
      condition: (ctx) =>
        ctx.vermoegen?.vermoegen === "below_10k" &&
        ctx.sozialleistungsBezug?.beziehtStaatlicheLeistungen === "Bürgergeld",
    },
    pageIDs.erwaerbstaetigkeit,
  ],
  [pageIDs.erwaerbstaetigkeit]: pageIDs.familienstand,
  [pageIDs.familienstand]: pageIDs.kinder,
  [pageIDs.kinder]: [
    {
      destination: pageIDs.kinderAnzahl,
      condition: (ctx) => ctx.kinder?.isPayingForKids === "yes",
    },
    pageIDs.unterhalt,
  ],
  [pageIDs.kinderAnzahl]: pageIDs.unterhalt,
  [pageIDs.unterhalt]: [
    {
      destination: pageIDs.unterhaltSumme,
      condition: (ctx) => ctx.unterhalt?.isPayingUnterhalt === "yes",
    },
    {
      destination: pageIDs.einkommenSingle,
      condition: (ctx) => ctx.familienstand?.partnerschaft === "no",
    },
    pageIDs.einkommenPartnerschaft,
  ],
  [pageIDs.unterhaltSumme]: [
    {
      destination: pageIDs.einkommenSingle,
      condition: (ctx) => ctx.familienstand?.partnerschaft === "no",
    },
    pageIDs.einkommenPartnerschaft,
  ],
  [pageIDs.einkommenSingle]: [
    {
      destination: pageIDs.erfolg,
      condition: (ctx) => {
        if (
          !ctx.einkommenSingle ||
          !ctx.erwaerbstaetigkeit ||
          !ctx.kinderAnzahl
        ) {
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
            ctx.kinderAnzahl.kids6Below,
            ctx.kinderAnzahl.kids7To14,
            ctx.kinderAnzahl.kids15To18,
            ctx.kinderAnzahl.kids18Above
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
          !ctx.kinderAnzahl
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
            ctx.kinderAnzahl.kids6Below,
            ctx.kinderAnzahl.kids7To14,
            ctx.kinderAnzahl.kids15To18,
            ctx.kinderAnzahl.kids18Above
          )
        );
      },
    },
    pageIDs.einkommenZuHoch,
  ],
};
export const formGraph = makeFormGraph(formFlow);
export const pathFinder = makePathFinder(formFlow);

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    isStepComponentWithSchema(step)
      ? withZod(step.schema)
      : withZod(z.object({})),
  ])
);
