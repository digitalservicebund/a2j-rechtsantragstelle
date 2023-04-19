import { freibetrag } from "../freibetrag";
import { allLongestPaths, makeFormGraph } from "../treeCalculations";
import { pageIDs } from "./pages";
import type { FormPages, AllowedIDs } from "./pages";
import type { z } from "zod";

export const initialStepID = pageIDs.rechtsschutzversicherung;
export const finalStep = pageIDs.erfolg;

// Type Context by infering all zod schemas (and dropping pageIDs without schema)
export type Context = Partial<{
  [T in AllowedIDs]: FormPages[T] extends { schema: any }
    ? z.infer<FormPages[T]["schema"]>
    : never;
}>;

export type ConditionFunction = (ctx: Context) => boolean;
interface ConditionalTransition {
  destination: AllowedIDs;
  condition: ConditionFunction;
}
export type TransitionElement = AllowedIDs | ConditionalTransition;
export type FormFlow = Partial<Record<AllowedIDs, TransitionElement[]>>;

const lastPageTransitions = [
  {
    destination: pageIDs.abschlussBeratung,
    condition: (ctx: Context) =>
      ctx.kostenfreieBeratung?.hasTriedFreeServices == "no" &&
      !isIncomeTooHigh(ctx),
  },
  {
    destination: pageIDs.abschlussEigeninitiative,
    condition: (ctx: Context) =>
      ctx.eigeninitiative?.hasHelpedThemselves == "no" && !isIncomeTooHigh(ctx),
  },
  {
    destination: pageIDs.einkommenZuHoch,
    condition: (ctx: Context) => isIncomeTooHigh(ctx),
  },
  pageIDs.erfolg,
];

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
  [pageIDs.eigeninitiativeWarnung]: [pageIDs.kostenfreieBeratung],
  [pageIDs.kostenfreieBeratung]: [
    {
      destination: pageIDs.staatlicheLeistungen,
      condition: (context) =>
        context.kostenfreieBeratung?.hasTriedFreeServices === "yes",
    },
    pageIDs.kostenfreieBeratungWarnung,
  ],
  [pageIDs.kostenfreieBeratungWarnung]: [pageIDs.staatlicheLeistungen],
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
  [pageIDs.erwerbstaetigkeit]: [pageIDs.partnerschaft],
  [pageIDs.partnerschaft]: [pageIDs.genauigkeit],
  [pageIDs.genauigkeit]: [
    {
      destination: pageIDs.kinderGrob,
      condition: (ctx) => ctx.genauigkeit?.wantsToKnowPrecisely === "no",
    },
    {
      destination: pageIDs.einkommen,
      condition: (ctx) => ctx.genauigkeit?.wantsToKnowPrecisely === "yes",
    },
  ],
  [pageIDs.kinderGrob]: [
    {
      destination: pageIDs.kinderAnzahlGrob,
      condition: (ctx) => ctx.kinderGrob?.isPayingForKids === "yes",
    },
    pageIDs.verfuegbaresEinkommen,
  ],
  [pageIDs.kinderAnzahlGrob]: [pageIDs.verfuegbaresEinkommen],
  [pageIDs.verfuegbaresEinkommen]: [
    {
      destination: pageIDs.erfolg,
      condition: (ctx) =>
        ctx.verfuegbaresEinkommen?.excessiveDisposableIncome === "no",
    },
    {
      destination: pageIDs.einkommenZuHoch,
      condition: (ctx) =>
        ctx.verfuegbaresEinkommen?.excessiveDisposableIncome === "yes",
    },
  ],
  [pageIDs.einkommen]: [
    {
      destination: pageIDs.einkommenPartner,
      condition: (ctx) => ctx.partnerschaft?.partnerschaft == "yes",
    },
    pageIDs.kinder,
  ],
  [pageIDs.einkommenPartner]: [pageIDs.kinder],
  [pageIDs.kinder]: [
    {
      destination: pageIDs.kinderAnzahl,
      condition: (ctx) => ctx.kinder?.isPayingForKids === "yes",
    },
    pageIDs.unterhalt,
  ],
  [pageIDs.kinderAnzahl]: [pageIDs.einkommenKinder],
  [pageIDs.einkommenKinder]: [pageIDs.unterhalt],
  [pageIDs.unterhalt]: [
    {
      destination: pageIDs.unterhaltSumme,
      condition: (ctx) => ctx.unterhalt?.isPayingUnterhalt === "yes",
    },
    pageIDs.miete,
  ],
  [pageIDs.unterhaltSumme]: [pageIDs.miete],
  [pageIDs.miete]: [pageIDs.weitereZahlungen],
  [pageIDs.weitereZahlungen]: [
    {
      destination: pageIDs.weitereZahlungenSumme,
      condition: (ctx) => ctx.weitereZahlungen?.hasWeitereZahlungen === "yes",
    },
    ...lastPageTransitions,
  ],
  [pageIDs.weitereZahlungenSumme]: lastPageTransitions,
};

const isIncomeTooHigh = (ctx: Context) =>
  (ctx.einkommen?.einkommen ?? 0) -
    (ctx.miete?.miete ?? 0) -
    (ctx.weitereZahlungenSumme?.weitereZahlungenSumme ?? 0) -
    20 >
  freibetrag(
    ctx.erwerbstaetigkeit?.isErwerbstaetig === "yes",
    ctx.partnerschaft?.partnerschaft === "yes",
    ctx.kinderAnzahl?.kids6Below,
    ctx.kinderAnzahl?.kids7To14,
    ctx.kinderAnzahl?.kids15To18,
    ctx.kinderAnzahl?.kids18Above
  );

export const formGraph = makeFormGraph(formFlow);
export const progress = allLongestPaths(finalStep, formGraph);
