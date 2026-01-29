type FooterContentType = "internalLink" | "externalLink" | "deletionBanner";

export type FooterContent = {
  key: string;
  type: FooterContentType[];
  sectionName?: string;
  title?: string;
  content: {
    text: string;
    url: string;
  }[];
};

export const footerContent: FooterContent[] = [
  {
    key: "rechtlicheHinweise",
    type: ["internalLink"],
    sectionName: "Rechtliche Hinweise",
    content: [
      {
        text: "Impressum",
        url: "/impressum",
      },
      {
        text: "Barrierefreiheit",
        url: "/barrierefreiheit",
      },
    ],
  },
  {
    key: "datenschutzerklaerungen",
    type: ["internalLink"],
    sectionName: "Datenschutzerklärungen",
    content: [
      {
        text: "service.justiz.de Datenschutz",
        url: "/datenschutz",
      },
      {
        text: "Beratungshilfe Datenschutz",
        url: "/beratungshilfe/datenschutz",
      },
      {
        text: "Prozesskostenhilfe Datenschutz",
        url: "/prozesskostenhilfe/datenschutz",
      },
      {
        text: "Fluggastrechte Datenschutz",
        url: "/fluggastrechte/datenschutz",
      },
    ],
  },
  {
    key: "kontaktUndTeilnahme",
    type: ["internalLink"],
    sectionName: "Kontakt und Teilnahme",
    content: [
      {
        text: "Kontakt",
        url: "/kontakt",
      },
      {
        text: "Open Source Code",
        url: "/opensource",
      },
    ],
  },
  {
    key: "persoenlicheDatenLoeschen",
    type: ["deletionBanner"],
    sectionName: "Persönliche Daten löschen",
    content: [
      {
        text: "Kontakt",
        url: "/persoenliche-daten-loeschen",
      },
    ],
  },
  {
    key: "bmjv",
    type: ["externalLink"],
    title: "Ein Pilotprojekt des",
    content: [
      {
        text: "Bundesministeriums der Justiz und für Verbraucherschutz",
        url: "https://www.bmjv.de/",
      },
    ],
  },
  {
    key: "digitalService",
    type: ["externalLink"],
    title: "Umsetzung und Betrieb durch",
    content: [
      {
        text: "DigitalService GmbH des Bundes",
        url: "https://digitalservice.bund.de/",
      },
    ],
  },
];
