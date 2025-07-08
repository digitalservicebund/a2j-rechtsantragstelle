import { type StrapiContentComponent } from "../cms/models/StrapiContentComponent";

const errorPage403: StrapiContentComponent = {
  __component: "page.info-box",
  items: [
    {
      label: {
        __component: "basic.heading",
        text: "403",
        tagName: "p",
        look: "ds-label-02-bold",
        id: 602,
      },
      headline: {
        __component: "basic.heading",
        text: "Zugriff nicht erlaubt",
        tagName: "h2",
        look: "ds-heading-02-reg",
        id: 603,
      },
      content:
        "<p>Es ist ein Fehler aufgetreten. Versuchen Sie die Seite neu zu laden.</p>\n",
      detailsSummary: [],
      inlineNotice: [],
      buttons: [],
      id: 363,
      details: [],
      inlineNotices: [],
    },
  ],
  container: {
    backgroundColor: "default",
    paddingTop: "default",
    paddingBottom: "default",
  },
  id: 121,
};

const errorPage404: StrapiContentComponent = {
  __component: "page.info-box",
  items: [
    {
      label: {
        __component: "basic.heading",
        text: "404",
        tagName: "div",
        look: "ds-label-02-bold",
        id: 599,
      },
      headline: {
        __component: "basic.heading",
        text: "Seite konnte nicht gefunden werden",
        tagName: "h1",
        look: "ds-heading-02-reg",
        id: 600,
      },
      content:
        "<p>Die von Ihnen gewünschte Seite ist leider nicht verfügbar. Das kann verschiedene Ursachen haben.</p>\n<p>Sie können folgendes probieren:</p>\n<ul>\n<li>Wenn Sie die URL direkt eingegeben haben, überprüfen Sie die Schreibweise.</li>\n<li>Versuchen Sie, die Seite von der Startseite aus erneut zu finden.</li>\n</ul>\n",
      id: 362,
      detailsSummary: [],
      inlineNotice: [],
      buttons: [],
      details: [],
      inlineNotices: [],
    },
  ],
  container: {
    backgroundColor: "default",
    paddingTop: "default",
    paddingBottom: "default",
  },
  id: 120,
};

const errorPage500: StrapiContentComponent = {
  __component: "page.info-box",
  items: [
    {
      label: {
        __component: "basic.heading",
        text: "500",
        tagName: "div",
        look: "ds-label-02-bold",
        id: 605,
      },
      headline: {
        __component: "basic.heading",
        text: "Unbekannter Fehler",
        tagName: "h1",
        look: "ds-heading-02-reg",
        id: 606,
      },
      content:
        "<p>Leider ist ein unbekannter Fehler aufgetreten. Wir arbeiten ständig an der Verbesserung unserer Services und sind bereits informiert.</p>\n<p>Bitte versuchen Sie es später noch einmal.</p>\n",
      id: 364,
      detailsSummary: [],
      inlineNotice: [],
      buttons: [],
      details: [],
      inlineNotices: [],
    },
  ],
  container: {
    backgroundColor: "default",
    paddingTop: "default",
    paddingBottom: "default",
  },
  id: 122,
};

export const ERROR_PAGES: Record<string, StrapiContentComponent[]> = {
  403: [errorPage403],
  404: [errorPage404],
  500: [errorPage500],
};
