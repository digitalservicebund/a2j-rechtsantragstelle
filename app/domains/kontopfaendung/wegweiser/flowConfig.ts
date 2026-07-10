import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { kontopfaendungWegweiserPages } from "./pages";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";

const kontopfaendungWegweiserPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(kontopfaendungWegweiserPages);

export const kontopfaendungWegweiserFlowConfig = compileFlow({
  pages: kontopfaendungWegweiserPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "kontopfaendung",
    kontopfaendung: [
      {
        guard: (context) => context.hasKontopfaendung === "ja",
        target: "pKonto",
      },
      {
        guard: (context) => context.hasKontopfaendung === "nein",
        target: "ergebnisKeineKontopfaendung",
      },
    ],
    ergebnisKeineKontopfaendung: null,
    pKonto: [
      {
        guard: (context) =>
          context.hasPKonto === "ja" || context.hasPKonto === "nein",
        target: "zwischenseiteUnterhalt",
      },
      {
        guard: (context) =>
          context.hasPKonto === "nichtAktiv" ||
          context.hasPKonto === "nichtEingerichtet",
        target: "pKontoProbleme",
      },
    ],
    pKontoProbleme: "zwischenseiteUnterhalt",
    zwischenseiteUnterhalt: "kinder",
    kinder: [
      {
        guard: (context) => context.hasKinder === "yes",
        target: "kinderWohnenZusammen",
      },
      {
        guard: (context) => context.hasKinder === "no",
        target: "partner",
      },
    ],
    kinderWohnenZusammen: [
      {
        guard: (context) =>
          context.kinderWohnenZusammen === "nein" ||
          context.kinderWohnenZusammen === "teilweise",
        target: "kinderUnterhalt",
      },
      {
        target: "partner",
      },
    ],
    kinderUnterhalt: "partner",
    partner: [
      {
        guard: (context) => context.verheiratet === "geschieden",
        target: "partnerUnterhalt",
      },
      {
        guard: (context) => context.verheiratet === "ja",
        target: "partnerWohnenZusammen",
      },
      {
        target: "zwischenseiteEinkuenfte",
      },
    ],
    partnerWohnenZusammen: [
      {
        guard: (context) => context.partnerWohnenZusammen === "yes",
        target: "zwischenseiteEinkuenfte",
      },
      {
        guard: (context) => context.partnerWohnenZusammen === "no",
        target: "partnerUnterhalt",
      },
    ],
    partnerUnterhalt: "zwischenseiteEinkuenfte",
    zwischenseiteEinkuenfte: "arbeit",
    arbeit: [
      {
        target: "arbeitArt",
        guard: (context) => context.hasArbeit === "yes",
      },
      {
        target: "sozialleistungen",
      },
    ],
    arbeitArt: [
      {
        target: "sozialleistungen",
        guard: (context) => context.arbeitArt === "selbstaendig",
      },
      {
        target: "nachzahlungArbeitgeber",
      },
    ],
    nachzahlungArbeitgeber: [
      {
        target: "hoeheNachzahlungArbeitgeber",
        guard: (context) => context.nachzahlungArbeitgeber === "yes",
      },
      {
        target: "einmalzahlungArbeitgeber",
      },
    ],
    hoeheNachzahlungArbeitgeber: "einmalzahlungArbeitgeber",
    einmalzahlungArbeitgeber: "sozialleistungen",
    sozialleistungen: [
      {
        target: "sozialleistungNachzahlung",
        guard: (context) =>
          context.hasSozialleistungen === "buergergeld" ||
          context.hasSozialleistungen === "grundsicherungSozialhilfe" ||
          context.hasSozialleistungen === "asylbewerberleistungen",
      },
      {
        target: "kindergeld",
        guard: (context) => context.hasKinder === "yes",
      },
      {
        target: "wohngeld",
      },
    ],
    sozialleistungNachzahlung: "sozialleistungenEinmalzahlung",
    sozialleistungenEinmalzahlung: [
      {
        target: "kindergeld",
        guard: (context) => context.hasKinder === "yes",
      },
      {
        target: "wohngeld",
      },
    ],
    pflegegeld: "rente",
    kindergeld: [
      {
        target: "kindergeldNachzahlung",
        guard: (context) => context.hasKindergeld === "yes",
      },
      {
        target: "wohngeld",
      },
    ],
    kindergeldNachzahlung: "wohngeld",
    wohngeld: [
      {
        target: "wohngeldEmpfaenger",
        guard: (context) => context.hasWohngeld === "yes",
      },
      {
        target: "pflegegeld",
      },
    ],
    wohngeldEmpfaenger: [
      {
        target: "wohngeldNachzahlung",
        guard: (context) => context.wohngeld === "selbst",
      },
      {
        target: "pflegegeld",
      },
    ],
    wohngeldNachzahlung: "pflegegeld",
    rente: "ergebnisNaechsteSchritte",
    ergebnisNaechsteSchritte: null,
  },
}) as CompiledFlow<PageConfigMap>;
