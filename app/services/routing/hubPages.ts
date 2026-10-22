import { type NavItem } from "~/components/navigation/types";

export const hubPages = ["/finanzielle-hilfen", "/nachlass"] as const;

type HubPages = (typeof hubPages)[number];

export const tableOfContents: Record<
  HubPages,
  Array<{ text?: string; url: string }>
> = {
  "/finanzielle-hilfen": [
    { url: "#intro", text: "Beratungshilfe und Prozesskostenhilfe" },
    {
      url: "#unterschiede",
      text: "Unterschiede und Gemeinsamkeiten von Beratungshilfe und Prozesskostenhilfe",
    },
    {
      url: "#weitere-beratungsmoeglichkeiten",
      text: "Weitere Beratungsmöglichkeiten",
    },
  ],
  "/nachlass": [
    { url: "#kurz", text: "Kurz erklärt" },
    { url: "#erben", text: "Unter diesen Bedingungen können Sie erben" },
    { url: "#pruefen", text: "Prüfen Sie das Erbe" },
    { url: "#erbausschlagung", text: "Erbausschlagung: Ein Erbe ablehnen" },
    { url: "#erbschein", text: "Erbschein: Ein Erbe nachweisen" },
    { url: "#steuer", text: "Erbschaftssteuer" },
  ],
};

export const navigationLists: Record<HubPages, NavItem[]> = {
  "/finanzielle-hilfen": [
    {
      label: "Beratungshilfe",
      destination: "/Beratungshilfe",
      state: "Current",
      subflows: [
        {
          label: "Übersicht",
          destination: "/beratungshilfe",
          state: "Open",
        },
        {
          label: "Vorab-Check",
          destination: "/beratungshilfe/vorabcheck",
          state: "Open",
        },
        {
          label: "Antrag",
          destination: "/beratungshilfe/antrag",
          state: "Open",
        },
        {
          label: "Benötigte Dokumente",
          destination: "/beratungshilfe/antragstellung/dokumente",
          state: "Open",
        },
        {
          label: "Tipps zur Anwaltssuche",
          destination: "/beratungshilfe/anwaltssuche",
          state: "Open",
        },
        {
          label: "Tipps zur anwaltlichen Beratung",
          destination: "/beratungshilfe/beratung",
          state: "Open",
        },
        {
          label: "Günstige Beratungsstellen",
          destination: "/beratungshilfe/kostenguenstigeBeratungsstellen",
          state: "Open",
        },
        {
          label: "Rechtsberatung in HH und HB",
          destination: "/beratungshilfe/oera",
          state: "Open",
        },
        {
          label: "Gerichtssuche",
          destination: "/beratungshilfe/zustaendiges-gericht/suche",
          state: "Open",
        },
        {
          label: "Onlineantrag über MJP",
          destination: "/beratungshilfe/beratungshilfeschein/mjp",
          state: "Open",
        },
      ],
    },
    {
      label: "Prozesskostenhilfe",
      destination: "/Prozesskostenhilfe",
      state: "Open",
      subflows: [
        {
          label: "Übersicht",
          destination: "/prozesskostenhilfe",
          state: "Open",
        },
        {
          label: "Beantragung",
          destination: "/prozesskostenhilfe/beantragung",
          state: "Open",
        },
        {
          label: "Voraussetzungen",
          destination: "/prozesskostenhilfe/voraussetzungen",
          state: "Open",
        },
        {
          label: "Kosten",
          destination: "/prozesskostenhilfe/kosten",
          state: "Open",
        },
        {
          label: "Ratenzahlungen",
          destination: "/prozesskostenhilfe/ratenzahlung",
          state: "Open",
        },
        {
          label: "Nachüberprüfung",
          destination: "/prozesskostenhilfe/nachueberpruefung",
          state: "Open",
        },
        {
          label: "Formular",
          destination: "/prozesskostenhilfe/formular-ausfuellen",
          state: "Open",
        },
        {
          label: "Antrag ohne anwaltliche Hilfe",
          destination: "/prozesskostenhilfe/beantragung-ohne-anwalt",
          state: "Open",
        },
      ],
    },
  ],
  "/nachlass": [
    {
      label: "Erbausschlagung",
      destination: "/Erbausschlagung",
      state: "Current",
      subflows: [
        {
          label: "Übersicht",
          destination: "/erbausschlagung",
          state: "Open",
        },
        {
          label: "Gerichtsfinder",
          destination: "/erbausschlagung/gericht-finden/start",
          state: "Open",
        },
        {
          label: "Erbausschlagung vorbereiten",
          destination: "/erbausschlagung/anfrage/start/start",
          state: "Open",
        },
      ],
    },
    {
      label: "Erbschein",
      destination: "/Erbschein",
      state: "Open",
      subflows: [
        {
          label: "Übersicht",
          destination: "/erbschein",
          state: "Open",
        },
        {
          label: "Erbschein-Wegweiser",
          destination: "/erbschein/wegweiser/start",
          state: "Open",
        },
        {
          label: "Nachlassgericht ermitteln",
          destination: "/erbschein/nachlassgericht/start",
          state: "Open",
        },
        {
          label: "Erbschein vorbereiten",
          destination: "/erbschein/anfrage/start",
          state: "Open",
        },
      ],
    },
  ],
};
