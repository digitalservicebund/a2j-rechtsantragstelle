import { type NavItem } from "~/components/navigation/types";

export const hubPages = [
  "/finanzielle-hilfen",
  "/nachlass",
  "/schulden-einfordern",
] as const;

type HubPages = (typeof hubPages)[number];

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
          label: "Rechtsberatung in Hamburg und Bremen",
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
  "/schulden-einfordern": [
    {
      label: "Digitale Zahlungsklage",
      destination: "/Zahlungsklage",
      state: "Current",
      subflows: [
        {
          label: "Informationen zur Zahlungsklage",
          destination: "/geld-einklagen",
          state: "Open",
        },
        {
          label: "Online-Verfahren: Geld einfordern",
          destination:
            "/geld-einklagen/formular/gericht-pruefen/intro/anwaltschaft",
          state: "Open",
        },
        {
          label: "Geld bei Flugproblemen einfordern",
          destination: "/fluggastrechte/vorabcheck/start",
          state: "Open",
        },
      ],
    },
    {
      label: "Mahnverfahren",
      destination: "/Mahnverfahren",
      state: "Open",
      subflows: [
        {
          label: "Informationen zum Mahnverfahren",
          destination: "/mahnverfahren",
          state: "Open",
        },
        {
          label: "Online-Mahnantrag stellen",
          destination: "/mahnverfahren-beantragen",
          state: "Open",
        },
      ],
    },
  ],
};
