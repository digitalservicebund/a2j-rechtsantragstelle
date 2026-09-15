import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const wohnungFlowConfig = {
  wohnungAlleineZusammen: [
    {
      guard: (context) => context.livingSituation === "alone",
      target: "wohnungGroesse",
    },
    { target: "wohnungAnzahlMitbewohner" },
  ],
  wohnungAnzahlMitbewohner: "wohnungGroesse",
  wohnungGroesse: "wohnungAnzahlZimmer",
  wohnungAnzahlZimmer: "wohnungMieteEigenheim",
  wohnungMieteEigenheim: [
    {
      guard: (context) =>
        context.rentsApartment === "yes" && context.livingSituation === "alone",
      target: "wohnungMieteAlleine",
    },
    {
      guard: (context) =>
        context.rentsApartment === "no" && context.livingSituation === "alone",
      target: "wohnungEigenheimNebenkosten",
    },
    {
      guard: (context) =>
        context.rentsApartment === "no" &&
        (context.livingSituation === "withOthers" ||
          context.livingSituation === "withRelatives"),
      target: "wohnungEigenheimNebenkostenGeteilt",
    },
    { target: "wohnungMieteZusammen" },
  ],
  wohnungMieteAlleine: "wohnungGarageParkplatz",
  wohnungMieteZusammen: "wohnungGarageParkplatz",
  wohnungGarageParkplatz: "wohnungNebenkosten",
  wohnungNebenkosten: "eigentumInfo",
  wohnungEigenheimNebenkosten: "eigentumInfo",
  wohnungEigenheimNebenkostenGeteilt: "eigentumInfo",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
