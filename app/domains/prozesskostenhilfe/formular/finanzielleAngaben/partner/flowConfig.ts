import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const partnerFlowConfig = {
  partnerschaft: [
    {
      guard: (context) => context.partnerschaft === "yes",
      target: "partnerZusammenleben",
    },
    { target: "kinder" },
  ],
  partnerZusammenleben: [
    {
      guard: (context) => context.zusammenleben === "yes",
      target: "partnerEinkommen",
    },
    { target: "partnerUnterhalt" },
  ],
  partnerUnterhalt: [
    {
      guard: (context) => context.unterhalt === "yes",
      target: "partnerUnterhaltsSumme",
    },
    { target: "partnerKeineRolle" },
  ],
  partnerUnterhaltsSumme: "partnerName",
  partnerEinkommen: [
    {
      guard: (context) => context.partnerEinkommen == "yes",
      target: "partnerStaatlicheLeistungen",
    },
    { target: "kinderFrage" },
  ],
  partnerKeineRolle: "kinderFrage",
  partnerName: "kinderFrage",
  partnerEinkuenfte: "partnerStaatlicheLeistungen",
  partnerStaatlicheLeistungen: [
    {
      guard: (context) =>
        context["partner-staatlicheLeistungen"] === "buergergeld",
      target: "partnerBuergergeld",
    },
    {
      guard: (context) =>
        context["partner-staatlicheLeistungen"] === "arbeitslosengeld",
      target: "partnerArbeitslosengeld",
    },
    {
      guard: (context) => context["partner-staatlicheLeistungen"] === "keine",
      target: "partnerErwerbstaetig",
    },
    { target: "kinderFrage" },
  ],
  partnerBuergergeld: "partnerEinkommen",
  partnerArbeitslosengeld: "partnerEinkommen",
  partnerEinkuenfteEinkommen: "partnerErwerbstaetig",
  partnerErwerbstaetig: [
    {
      guard: (context) => context["partner-currentlyEmployed"] === "no",
      target: "partnerRenteFrage",
    },
    { target: "partnerArt" },
  ],
  partnerArt: [
    {
      guard: (context) =>
        context["partner-employmentType"] === "employed" ||
        context["partner-employmentType"] === "employedAndSelfEmployed",
      target: "partnerNettoEinkommen",
    },
    { target: "partnerSelbststaendig" },
  ],
  partnerNettoEinkommen: [
    {
      guard: (context) =>
        context["partner-employmentType"] === "selfEmployed" ||
        context["partner-employmentType"] === "employedAndSelfEmployed",
      target: "partnerSelbststaendig",
    },
    {
      guard: (context) =>
        context["partner-currentlyEmployed"] === "yes" &&
        context["partner-staatlicheLeistungen"] === "buergergeld",
      target: "partnerArbeitsweg",
    },
    { target: "partnerRenteFrage" },
  ],
  partnerSelbststaendig: "partnerSelbststaendigAbzuege",
  partnerSelbststaendigAbzuege: [
    {
      guard: (context) =>
        context["partner-currentlyEmployed"] === "yes" &&
        context["partner-staatlicheLeistungen"] === "buergergeld",
      target: "partnerAbzuege",
    },
    { target: "partnerRenteFrage" },
  ],
  partnerAbzuege: "partnerArbeitsweg",
  partnerArbeitsweg: [
    {
      guard: (context) => context["partner-arbeitsweg"] === "publicTransport",
      target: "partnerOpnvKosten",
    },
    {
      guard: (context) => context["partner-arbeitsweg"] === "privateVehicle",
      target: "partnerArbeitsplatzEntfernung",
    },
    {
      guard: (context) =>
        context["partner-arbeitsweg"] === "bike" ||
        context["partner-arbeitsweg"] === "walking",
      target: "partnerArbeitswegKeineRolle",
    },
    { target: "partnerArbeitsausgaben" },
  ],
  partnerOpnvKosten: "partnerArbeitsplatzEntfernung",
  partnerArbeitsplatzEntfernung: "partnerArbeitsausgaben",
  partnerArbeitswegKeineRolle: "partnerArbeitsausgaben",
  partnerArbeitsausgaben: "partnerArbeitsausgabenFrage",
  partnerArbeitsausgabenFrage: [
    {
      guard: (context) => context["partner-hasArbeitsausgaben"] === "yes",
      target: "partnerArbeitsausgabenUebersicht",
    },
    { target: "partnerRenteFrage" },
  ],
  partnerArbeitsausgabenUebersicht: [
    {
      type: "addArrayItem",
      target: "partnerArbeitsausgabe",
    },
    {
      guard: (context) =>
        context["partner-hasArbeitsausgaben"] === "yes" &&
        !arrayIsNonEmpty(context.partnerArbeitsausgabe),
      target: "partnerArbeitsausgabenWarnung",
    },
    { target: "partnerRenteFrage" },
  ],
  partnerArbeitsausgabenWarnung: "partnerRenteFrage",
  partnerArbeitsausgabe: "partnerArbeitsausgabenUebersicht",
  partnerRenteFrage: [
    {
      guard: (context) => context["partner-receivesPension"] === "yes",
      target: "partnerRente",
    },
    { target: "partnerEinkuenfteUnterhaltFrage" },
  ],
  partnerRente: "partnerEinkuenfteUnterhaltFrage",
  partnerEinkuenfteUnterhaltFrage: [
    {
      guard: (context) => context["partner-receivesSupport"] === "yes",
      target: "partnerEinkuenfteUnterhalt",
    },
    { target: "partnerEinkuenfteLeistungen" },
  ],
  partnerEinkuenfteUnterhalt: "partnerEinkuenfteLeistungen",
  partnerEinkuenfteKeineRolle: null,
  partnerEinkuenfteLeistungen: "partnerLeistungFrage",
  partnerLeistungFrage: [
    {
      guard: (context) => context.partnerLeistungen?.wohngeld === "on",
      target: "partnerWohngeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.krankengeld === "on",
      target: "partnerKrankengeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.elterngeld === "on",
      target: "partnerElterngeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.kinderFragegeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfte" },
  ],
  partnerWohngeld: [
    {
      guard: (context) => context.partnerLeistungen?.krankengeld === "on",
      target: "partnerKrankengeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.elterngeld === "on",
      target: "partnerElterngeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.kinderFragegeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfte" },
  ],
  partnerKrankengeld: [
    {
      guard: (context) => context.partnerLeistungen?.elterngeld === "on",
      target: "partnerElterngeld",
    },
    {
      guard: (context) => context.partnerLeistungen?.kinderFragegeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfte" },
  ],
  partnerElterngeld: [
    {
      guard: (context) => context.partnerLeistungen?.kindergeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfte" },
  ],
  partnerKindergeld: "partnerWeitereEinkuenfte",
  partnerWeitereEinkuenfte: "partnerWeitereEinkuenfteUebersicht",
  partnerWeitereEinkuenfteFrage: [
    {
      guard: (context) => context["partner-hasFurtherIncome"] === "yes",
      target: "partnerWeitereEinkuenfteUebersicht",
    },
    { target: "partnerBesondersAusgaben" },
  ],
  partnerWeitereEinkuenfteUebersicht: [
    {
      type: "addArrayItem",
      target: "partnerWeitereEinkunft",
    },
    {
      guard: (context) =>
        context["partner-hasFurtherIncome"] === "yes" &&
        !arrayIsNonEmpty(context.partnerWeitereEinkuenfte),
      target: "partnerWeitereEinkuenfteWarnung",
    },
    { target: "partnerBesondersAusgaben" },
  ],
  partnerWeitereEinkuenfteWarnung: "partnerBesondersAusgaben",
  partnerWeitereEinkunft: "partnerWeitereEinkuenfteUebersicht",
  partnerBesondersAusgaben: [
    {
      guard: (context) => context.partnerHasBesondersAusgaben === "yes",
      target: "partnerAddBesondersAusgaben",
    },
    { target: "kinder" },
  ],
  partnerAddBesondersAusgaben: "kinder",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
