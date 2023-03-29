import { isStepComponentWithSchema, Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { freibetrag } from "./freibetrag";
import { allLongestPaths, makeFormGraph } from "./treeCalculations";

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
  familienstand: Steps.familienstandStep,
  erfolgBuergergeld: Steps.successBuergergeldStep,
  kinder: Steps.kinderStep,
  kinderAnzahl: Steps.kinderAnzahlStep,
  unterhalt: Steps.unterhaltStep,
  unterhaltSumme: Steps.unterhaltSummeStep,
  erwerbstaetigkeit: Steps.erwerbstaetigkeitStep,
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

export const initialStepID = pageIDs.rechtsschutzversicherung;
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
  [pageIDs.rechtsschutzversicherung]: [
    {
      destination: pageIDs.rechtsschutzversicherungError,
      condition: (context) =>
        context.rechtsschutzversicherung?.hasRechtsschutzversicherung === "yes",
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
    pageIDs.beratungshilfeBeantragt,
  ],
  [pageIDs.beratungshilfeBeantragt]: [
    {
      destination: pageIDs.beratungshilfeBeantragtError,
      condition: (context) =>
        context.beratungshilfeBeantragt?.hasBeratungshilfeBeantragt === "yes",
    },
    pageIDs.eigeninitiative,
  ],
  [pageIDs.eigeninitiative]: [
    {
      destination: pageIDs.kostenfreieBeratung,
      condition: (context) =>
        context.eigeninitiative?.hasHelpedThemselves === "yes",
    },
    pageIDs.eigeninitiativeWarnung,
  ],
  [pageIDs.eigeninitiativeWarnung]: pageIDs.kostenfreieBeratung,
  [pageIDs.kostenfreieBeratung]: [
    {
      destination: pageIDs.staatlicheLeistungen,
      condition: (context) =>
        context.kostenfreieBeratung?.hasTriedFreeServices === "yes",
    },
    pageIDs.kostenfreieBeratungWarnung,
  ],
  [pageIDs.kostenfreieBeratungWarnung]: pageIDs.staatlicheLeistungen,
  [pageIDs.staatlicheLeistungen]: [
    {
      destination: pageIDs.erfolgLeistungsbezug,
      condition: (ctx) =>
        ctx.staatlicheLeistungen?.staatlicheLeistung === "grundsicherung" ||
        ctx.staatlicheLeistungen?.staatlicheLeistung ===
          "asylbewerberleistungen",
    },
    pageIDs.vermoegen,
  ],
  [pageIDs.vermoegen]: [
    {
      destination: pageIDs.vermoegenError,
      condition: (ctx) => ctx.vermoegen?.vermoegen === "above_10k",
    },
    {
      destination: pageIDs.erfolgBuergergeld,
      condition: (ctx) =>
        ctx.vermoegen?.vermoegen === "below_10k" &&
        ctx.staatlicheLeistungen?.staatlicheLeistung === "buergergeld",
    },
    pageIDs.erwerbstaetigkeit,
  ],
  [pageIDs.erwerbstaetigkeit]: pageIDs.familienstand,
  [pageIDs.familienstand]: pageIDs.kinder,
  [pageIDs.kinder]: [
    {
      destination: pageIDs.unterhalt,
      condition: (ctx) => ctx.kinder?.isPayingForKids === "no",
    },
    pageIDs.kinderAnzahl,
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
        const einkommen = ctx.einkommenSingle?.einkommenSingle ?? 0;
        const isErwerbstaetig =
          ctx.erwerbstaetigkeit?.isErwerbstaetig === "yes";

        return (
          einkommen <=
          freibetrag(
            isErwerbstaetig,
            false,
            ctx.kinderAnzahl?.kids6Below,
            ctx.kinderAnzahl?.kids7To14,
            ctx.kinderAnzahl?.kids15To18,
            ctx.kinderAnzahl?.kids18Above
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
        const einkommen = ctx.einkommenPartnerschaft?.einkommenFamilie ?? 0;
        const isErwerbstaetig =
          ctx.erwerbstaetigkeit?.isErwerbstaetig === "yes";

        const freibetragFamilie = freibetrag(
          isErwerbstaetig,
          true,
          ctx.kinderAnzahl?.kids6Below,
          ctx.kinderAnzahl?.kids7To14,
          ctx.kinderAnzahl?.kids15To18,
          ctx.kinderAnzahl?.kids18Above
        );
        return einkommen - freibetragFamilie <= 20;
      },
    },
    pageIDs.einkommenZuHoch,
  ],
};
export const formGraph = makeFormGraph(formFlow);
export const progress = allLongestPaths(finalStep, formGraph);

export const allValidators = Object.fromEntries(
  Object.entries(formPages).map(([key, step]) => [
    key,
    isStepComponentWithSchema(step)
      ? withZod(step.schema)
      : withZod(z.object({})),
  ])
);
