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
type Transition = AllowedIDs | TransitionElement[];
export type FormFlow = Partial<Record<AllowedIDs, Transition>>;

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
      destination: pageIDs.einkommenFamilie,
      condition: (ctx) =>
        ctx.familienstand?.partnerschaft === "yes" ||
        ctx.kinder?.isPayingForKids === "yes",
    },
    pageIDs.einkommenSingle,
  ],
  [pageIDs.unterhaltSumme]: [
    {
      destination: pageIDs.einkommenFamilie,
      condition: (ctx) =>
        ctx.familienstand?.partnerschaft === "yes" ||
        ctx.kinder?.isPayingForKids === "yes",
    },
    pageIDs.einkommenSingle,
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
  [pageIDs.einkommenFamilie]: [
    {
      destination: pageIDs.erfolg,
      condition: (ctx) => {
        const einkommen = ctx.einkommenFamilie?.einkommenFamilie ?? 0;
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
