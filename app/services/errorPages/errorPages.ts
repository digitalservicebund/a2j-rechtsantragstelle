import { type StrapiContentComponent } from "../cms/models/formElements/StrapiContentComponent";

const errorPage403: StrapiContentComponent = {
  __component: "page.box",
  label: {
    __component: "basic.heading",
    text: "403",
    tagName: "p",
    id: 602,
  } as any,
  heading: {
    __component: "basic.heading",
    text: "Zugriff nicht erlaubt",
    tagName: "h2",
    id: 603,
  } as any,
  content: {
    __component: "basic.paragraph",
    html: "<p>Es ist ein Fehler aufgetreten. Versuchen Sie die Seite neu zu laden.</p>\n",
    id: 363,
  },
  buttons: [],
  variant: undefined,
  id: 121,
};

const errorPage404: StrapiContentComponent = {
  __component: "page.box",
  label: {
    __component: "basic.heading",
    text: "404",
    tagName: "div",
    id: 599,
  } as any,
  heading: {
    __component: "basic.heading",
    text: "Seite konnte nicht gefunden werden",
    tagName: "h1",
    id: 600,
  } as any,
  content: {
    __component: "basic.paragraph",
    html: "<p>Die von Ihnen gewünschte Seite ist leider nicht verfügbar. Das kann verschiedene Ursachen haben.</p>\n<p>Sie können folgendes probieren:</p>\n<ul>\n<li>Wenn Sie die URL direkt eingegeben haben, überprüfen Sie die Schreibweise.</li>\n<li>Versuchen Sie, die Seite von der Startseite aus erneut zu finden.</li>\n</ul>\n",
    id: 362,
  },
  buttons: [],
  variant: undefined,
  id: 120,
};

const errorPage500: StrapiContentComponent = {
  __component: "page.box",
  label: {
    __component: "basic.heading",
    text: "500",
    tagName: "div",
    id: 605,
  } as any,
  heading: {
    __component: "basic.heading",
    text: "Unbekannter Fehler",
    tagName: "h1",
    id: 606,
  } as any,
  content: {
    __component: "basic.paragraph",
    html: "<p>Leider ist ein unbekannter Fehler aufgetreten. Wir arbeiten ständig an der Verbesserung unserer Services und sind bereits informiert.</p>\n<p>Bitte versuchen Sie es später noch einmal.</p>\n",
    id: 364,
  },
  buttons: [],
  variant: undefined,
  id: 122,
};

export const ERROR_PAGES: Record<string, StrapiContentComponent[]> = {
  403: [errorPage403],
  404: [errorPage404],
  500: [errorPage500],
};
