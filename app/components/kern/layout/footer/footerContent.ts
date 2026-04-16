import { translations } from "~/services/translations/translations";

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
    sectionName: translations.footer.rechtlicheHinweise.de,
    content: [
      {
        text: translations.footer.impressum.de,
        url: "/impressum",
      },
      {
        text: translations.footer.barrierefreiheit.de,
        url: "/barrierefreiheit",
      },
      {
        text: translations.footer.datenschutz.de,
        url: "/datenschutzerklaerung",
      },
    ],
  },
  {
    key: "kontaktUndTeilnahme",
    type: "internalLink",
    sectionName: translations.footer.kontaktUndTeilnahme.de,
    content: [
      {
        text: translations.footer.kontakt.de,
        url: "/kontakt",
      },
      {
        text: translations.footer.openSourceCode.de,
        url: "/opensource",
      },
      {
        text: translations.footer.feedbackStudien.de,
        url: "/feedback",
      },
    ],
  },
  {
    key: "persoenlicheDatenLoeschen",
    type: "deletionBanner",
    sectionName: translations.footer.persoenlicheDatenLoeschen.de,
    content: [
      {
        text: translations.footer.persoenlicheDatenLoeschen.de,
        url: "/persoenliche-daten-loeschen",
      },
    ],
  },
  {
    key: "bmjv",
    type: "externalLink",
    title: translations.footer.pilotProjekt.de,
    content: [
      {
        text: translations.footer.bmjv.de,
        url: "https://www.bmjv.de/",
      },
    ],
  },
  {
    key: "digitalService",
    type: "externalLink",
    title: translations.footer.umsetztung.de,
    content: [
      {
        text: translations.footer.digitalService.de,
        url: "https://digitalservice.bund.de/",
      },
    ],
  },
];
