import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { beratungshilfeVorabcheckPages } from "./pages";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import { isIncomeTooHigh } from "./isIncomeTooHigh";
import { type BeratungshilfeVorabcheckUserData } from "./userData";

const beratungshilfeVorabcheckPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(beratungshilfeVorabcheckPages);

const staatlicheLeistungenYes = (context: BeratungshilfeVorabcheckUserData) =>
  context.staatlicheLeistungen === "grundsicherung" ||
  context.staatlicheLeistungen === "asylbewerberleistungen";

export const beratungshilfeVorabcheckFlowConfig = compileFlow({
  pages: beratungshilfeVorabcheckPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "rechtsschutzversicherung",
    rechtsschutzversicherung: [
      {
        guard: (context) => context.rechtsschutzversicherung === "yes",
        target: "rechtsschutzversicherungDetails",
      },
      {
        target: "wurdeVerklagt",
      },
    ],
    rechtsschutzversicherungDetails: [
      {
        guard: (context) => context.rsvCoverage === "yes",
        target: "rechtsschutzversicherungAbbruch",
      },
      {
        guard: (context) => context.rsvCoverage === "tooExpensive",
        target: "rechtsschutzversicherungHinweisSelbstbeteiligung",
      },
      {
        guard: (context) => context.rsvCoverage === "unknown",
        target: "rechtsschutzversicherungUngewissAbbruch",
      },
      {
        target: "rechtsschutzversicherungHinweisKostenuebernahme",
      },
    ],
    rechtsschutzversicherungAbbruch: null,
    rechtsschutzversicherungHinweisSelbstbeteiligung: "wurdeVerklagt",
    rechtsschutzversicherungUngewissAbbruch: null,
    rechtsschutzversicherungHinweisKostenuebernahme: "wurdeVerklagt",
    wurdeVerklagt: [
      {
        guard: (context) => context.wurdeVerklagt === "yes",
        target: "wurdeVerklagtAbbruch",
      },
      {
        target: "klageEingereicht",
      },
    ],
    wurdeVerklagtAbbruch: null,
    klageEingereicht: [
      {
        guard: (context) => context.klageEingereicht === "no",
        target: "hamburgOderBremen",
      },
      {
        target: "klageEingereichtAbbruch",
      },
    ],
    klageEingereichtAbbruch: null,
    hamburgOderBremen: [
      {
        guard: (context) => context.hamburgOderBremen === "no",
        target: "beratungshilfeBeantragt",
      },
      {
        target: "hamburgOderBremenAbbruch",
      },
    ],
    hamburgOderBremenAbbruch: null,
    beratungshilfeBeantragt: [
      {
        guard: (context) => context.beratungshilfeBeantragt === "no",
        target: "eigeninitiative",
      },
      {
        target: "beratungshilfeBeantragtAbbruch",
      },
    ],
    beratungshilfeBeantragtAbbruch: null,
    eigeninitiative: [
      {
        guard: (context) => context.eigeninitiative === "yes",
        target: "bereich",
      },
      {
        target: "eigeninitiativeWarnung",
      },
    ],
    eigeninitiativeWarnung: "bereich",
    bereich: "staatlicheLeistungen",
    staatlicheLeistungen: [
      {
        guard: (context) =>
          context.eigeninitiative === "no" && staatlicheLeistungenYes(context),
        target: "staatlicheLeistungenAbschlussVielleicht",
      },
      {
        guard: (context) => staatlicheLeistungenYes(context),
        target: "staatlicheLeistungenAbschlussJa",
      },
      {
        guard: (context) =>
          context.staatlicheLeistungen === "buergergeld" ||
          context.staatlicheLeistungen === "keine",
        target: "vermoegen",
      },
    ],
    staatlicheLeistungenAbschlussVielleicht: null,
    staatlicheLeistungenAbschlussJa: null,
    vermoegen: [
      {
        guard: (context) =>
          context.vermoegen === "below_10k" &&
          context.staatlicheLeistungen === "buergergeld" &&
          context.eigeninitiative === "no",
        target: "vermoegenAbschlussVielleicht",
      },
      {
        guard: (context) =>
          context.vermoegen === "below_10k" &&
          context.staatlicheLeistungen === "buergergeld",
        target: "vermoegenAbschlussJa",
      },
      {
        guard: (context) => context.vermoegen === "below_10k",
        target: "erwerbstaetigkeit",
      },
      {
        guard: (context) => context.vermoegen === "above_10k",
        target: "vermoegenAbschlussAbbruch",
      },
    ],
    vermoegenAbschlussJa: null,
    vermoegenAbschlussVielleicht: null,
    vermoegenAbschlussAbbruch: null,
    erwerbstaetigkeit: "partnerschaft",
    partnerschaft: "genauigkeit",
    genauigkeit: [
      {
        guard: (context) => context.genauigkeit === "no",
        target: "kinderKurz",
      },
      {
        target: "einkommen",
      },
    ],
    kinderKurz: [
      {
        guard: (context) => context.kinderKurz === "yes",
        target: "kinderAnzahlKurz",
      },
      {
        target: "verfuegbaresEinkommen",
      },
    ],
    kinderAnzahlKurz: [
      {
        guard: (context) => context.kinderAnzahlKurz != null,
        target: "verfuegbaresEinkommen",
      },
    ],
    verfuegbaresEinkommen: [
      {
        guard: (context) =>
          context.verfuegbaresEinkommen === "no" &&
          context.eigeninitiative === "yes",
        target: "verfuegbaresEinkommenAbschlussJa",
      },
      {
        guard: (context) => context.verfuegbaresEinkommen === "no",
        target: "verfuegbaresEinkommenAbschlussVielleicht",
      },
      {
        guard: (context) => context.verfuegbaresEinkommen === "yes",
        target: "verfuegbaresEinkommenAbschlussNein",
      },
    ],
    verfuegbaresEinkommenAbschlussJa: null,
    verfuegbaresEinkommenAbschlussVielleicht: null,
    verfuegbaresEinkommenAbschlussNein: null,
    einkommen: [
      {
        guard: (context) => context.partnerschaft === "yes",
        target: "einkommenPartner",
      },
      {
        target: "kinder",
      },
    ],
    einkommenPartner: "kinder",
    kinder: [
      {
        guard: (context) => context.kinder === "yes",
        target: "kinderAnzahl",
      },
      {
        target: "unterhalt",
      },
    ],
    kinderAnzahl: [
      {
        guard: (context) =>
          context.kids?.kids6Below != undefined ||
          context.kids?.kids7To14 != undefined ||
          context.kids?.kids15To18 != undefined ||
          context.kids?.kids18Above != undefined,
        target: "einkommenKinder",
      },
    ],
    einkommenKinder: [
      {
        guard: (context) => context.einkommenKinder != undefined,
        target: "unterhalt",
      },
    ],
    unterhalt: [
      {
        guard: (context) => context.unterhalt === "yes",
        target: "unterhaltSumme",
      },
      {
        target: "miete",
      },
    ],
    unterhaltSumme: [
      {
        guard: (context) => context.unterhaltSumme != undefined,
        target: "miete",
      },
    ],
    miete: [
      {
        guard: (context) => context.miete != undefined,
        target: "weitereZahlungenSumme",
      },
    ],
    weitereZahlungenSumme: [
      {
        guard: (context) =>
          context.eigeninitiative === "no" && !isIncomeTooHigh({ context }),
        target: "weitereZahlungenSummeAbschlussVielleicht",
      },
      {
        guard: (context) => isIncomeTooHigh({ context }),
        target: "weitereZahlungenSummeAbschlussNein",
      },
      {
        guard: (context) => context.weitereZahlungenSumme != undefined,
        target: "weitereZahlungenSummeAbschlussJa",
      },
    ],
    weitereZahlungenSummeAbschlussJa: null,
    weitereZahlungenSummeAbschlussVielleicht: null,
    weitereZahlungenSummeAbschlussNein: null,
  },
}) as CompiledFlow<PageConfigMap>;
