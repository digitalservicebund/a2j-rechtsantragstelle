import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const partnerFlowConfig = {
  partnerschaft: [
    {
      guard: (context) => context.partnerschaft === "yes",
      target: "partnerZusammenleben",
    },
    { target: "kinderFrage" },
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
        !(
          context["partner-currentlyEmployed"] === "yes" &&
          context["partner-staatlicheLeistungen"] === "buergergeld"
        ),
      target: "partnerArbeitsweg",
    },
    { target: "partnerRenteFrage" },
  ],
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
    { target: "partnerArbeitsausgabenFrage" },
  ],
  partnerOpnvKosten: "partnerArbeitsplatzEntfernung",
  partnerArbeitsplatzEntfernung: "partnerArbeitsausgabenFrage",
  partnerArbeitswegKeineRolle: "partnerArbeitsausgabenFrage",
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
        !arrayIsNonEmpty(context["partner-arbeitsausgaben"]),
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
    { target: "partnerLeistungFrage" },
  ],
  partnerEinkuenfteUnterhalt: "partnerLeistungFrage",
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
      guard: (context) => context.partnerLeistungen?.kindergeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfteFrage" },
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
    { target: "partnerWeitereEinkuenfteFrage" },
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
    { target: "partnerWeitereEinkuenfteFrage" },
  ],
  partnerElterngeld: [
    {
      guard: (context) => context.partnerLeistungen?.kindergeld === "on",
      target: "partnerKindergeld",
    },
    { target: "partnerWeitereEinkuenfteFrage" },
  ],
  partnerKindergeld: "partnerWeitereEinkuenfteFrage",
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
        !arrayIsNonEmpty(context["partner-weitereEinkuenfte"]),
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
    { target: "kinderFrage" },
  ],
  partnerAddBesondersAusgaben: "kinderFrage",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
