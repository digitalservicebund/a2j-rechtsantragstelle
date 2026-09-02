import { layoutTranslations } from "~/services/translations/layout";

type FooterContentType = "internalLink" | "externalLink" | "deletionBanner";

type FooterContent = {
  key: string;
  type: FooterContentType;
  sectionName?: string;
  title?: string;
  content: Array<{
    text: string;
    url: string;
  }>;
};

export const footerContent: FooterContent[] = [
  {
    key: "rechtlicheHinweise",
    type: "internalLink",
    sectionName: layoutTranslations.footer.rechtlicheHinweise.de,
    content: [
      {
        text: layoutTranslations.footer.impressum.de,
        url: "/impressum",
      },
      {
        text: layoutTranslations.footer.barrierefreiheit.de,
        url: "/barrierefreiheit",
      },
      {
        text: layoutTranslations.footer.datenschutz.de,
        url: "/datenschutzerklaerung",
      },
    ],
  },
  {
    key: "kontaktUndTeilnahme",
    type: "internalLink",
    sectionName: layoutTranslations.footer.kontaktUndTeilnahme.de,
    content: [
      {
        text: layoutTranslations.footer.kontakt.de,
        url: "/kontakt",
      },
      {
        text: layoutTranslations.footer.openSourceCode.de,
        url: "/opensource",
      },
      {
        text: layoutTranslations.footer.anBefragungenTeilnehmen.de,
        url: "/feedback",
      },
    ],
  },
  {
    key: "persoenlicheDatenLoeschen",
    type: "deletionBanner",
    sectionName: layoutTranslations.footer.persoenlicheDatenLoeschen.de,
    content: [
      {
        text: layoutTranslations.footer.persoenlicheDatenLoeschen.de,
        url: "/persoenliche-daten-loeschen",
      },
    ],
  },
  {
    key: "bmjv",
    type: "externalLink",
    title: layoutTranslations.footer.pilotProjekt.de,
    content: [
      {
        text: layoutTranslations.footer.bmjv.de,
        url: "https://www.bmjv.de/",
      },
    ],
  },
  {
    key: "digitalService",
    type: "externalLink",
    title: layoutTranslations.footer.umsetztung.de,
    content: [
      {
        text: layoutTranslations.footer.digitalService.de,
        url: "https://digitalservice.bund.de/",
      },
      {
        text: layoutTranslations.footer.projektZugangZumRecht.de,
        url: "https://www.zugang-zum-recht-projekte.de/",
      },
    ],
  },
];
