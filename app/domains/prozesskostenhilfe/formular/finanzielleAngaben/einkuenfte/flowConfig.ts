import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const einkuenfteFlowConfig = {
  einkuenfteStart: "staatlicheLeistungen",
  staatlicheLeistungen: [
    {
      guard: (context) => context.staatlicheLeistungen === "buergergeld",
      target: "buergergeld",
    },
    {
      guard: (context) => context.staatlicheLeistungen === "arbeitslosengeld",
      target: "arbeitslosengeld",
    },
    {
      guard: (context) => context.staatlicheLeistungen === "keine",
      target: "erwerbstaetig",
    },
    { target: "gesetzlicheVertretungFrage" },
  ],
  buergergeld: "erwerbstaetig",
  arbeitslosengeld: "erwerbstaetig",
  erwerbstaetig: [
    {
      guard: (context) => context.currentlyEmployed === "no",
      target: "renteFrage",
    },
    {
      target: "art",
    },
  ],
  art: [
    {
      guard: (context) =>
        context.employmentType === "employed" ||
        context.employmentType === "employedAndSelfEmployed",
      target: "nettoEinkommen",
    },
    { target: "selbststaendig" },
  ],
  nettoEinkommen: [
    {
      guard: (context) =>
        context.employmentType === "selfEmployed" ||
        context.employmentType === "employedAndSelfEmployed",
      target: "renteFrage",
    },
    { target: "art" },
  ],
  selbststaendig: "selbststaendigAbzuege",
  selbststaendigAbzuege: "renteFrage",
  renteFrage: [
    {
      guard: (context) => context.receivesPension === "yes",
      target: "rente",
    },
    { target: "leistungenFrage" },
  ],
  rente: "leistungenFrage",
  leistungenFrage: [
    {
      guard: (context) => context.leistungen?.wohngeld === "on",
      target: "wohngeld",
    },
    {
      guard: (context) => context.leistungen?.krankengeld === "on",
      target: "krankengeld",
    },
    {
      guard: (context) => context.leistungen?.elterngeld === "on",
      target: "elterngeld",
    },
    {
      guard: (context) => context.leistungen?.kindergeld === "on",
      target: "kindergeld",
    },
    {
      target: "weitereEinkuenfte",
    },
  ],
  wohngeld: [
    {
      guard: (context) => context.leistungen?.krankengeld === "on",
      target: "krankengeld",
    },
    {
      guard: (context) => context.leistungen?.elterngeld === "on",
      target: "elterngeld",
    },
    {
      guard: (context) => context.leistungen?.kindergeld === "on",
      target: "kindergeld",
    },
    {
      target: "weitereEinkuenfte",
    },
  ],
  krankengeld: [
    {
      guard: (context) => context.leistungen?.elterngeld === "on",
      target: "elterngeld",
    },
    {
      guard: (context) => context.leistungen?.kindergeld === "on",
      target: "kindergeld",
    },
    {
      target: "weitereEinkuenfte",
    },
  ],
  elterngeld: [
    {
      guard: (context) => context.leistungen?.kindergeld === "on",
      target: "kindergeld",
    },
    {
      target: "weitereEinkuenfte",
    },
  ],
  kindergeld: "weitereEinkuenfte",
  weitereEinkuenfte: "weitereEinkuenfteUebersicht",
  weitereEinkuenfteFrage: [
    {
      guard: (context) => context.hasFurtherIncome === "yes",
      target: "weitereEinkuenfteUebersicht",
    },
    {
      guard: (context) =>
        context.currentlyEmployed === "yes" &&
        context.staatlicheLeistungen !== "buergergeld",
      target: "arbeitsweg",
    },
    { target: "partnerschaft" },
  ],
  weitereEinkuenfteUebersicht: [
    {
      type: "addArrayItem",
      target: "weitereEinkunft",
    },
    {
      guard: (context) =>
        context.hasFurtherIncome === "yes" &&
        !arrayIsNonEmpty(context.weitereEinkuenfte),
      target: "weitereEinkuenfteWarnung",
    },
    {
      guard: (context) =>
        context.currentlyEmployed === "yes" &&
        context.staatlicheLeistungen !== "buergergeld",
      target: "arbeitsweg",
    },
    {
      target: "partnerschaft",
    },
  ],
  weitereEinkuenfteWarnung: [
    {
      guard: (context) =>
        context.currentlyEmployed === "yes" &&
        context.staatlicheLeistungen !== "buergergeld",
      target: "arbeitsweg",
    },
    {
      target: "partnerschaft",
    },
  ],
  weitereEinkunft: null,
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
