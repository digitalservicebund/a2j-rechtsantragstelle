import { type TranslationRecord } from "~/services/translations/getTranslationByKey";

export const translations = {
  fileUpload: {
    select: {
      de: "Datei auswählen",
    },
    addAnother: {
      de: "Weitere Datei auswählen",
    },
    upload: {
      de: "Hochladen",
    },
    delete: {
      de: "Löschen",
    },
  },
  "delete-data": {
    back: {
      de: "Zurück ohne zu löschen",
    },
    confirm: {
      de: "Ja, Daten löschen",
    },
    footerLinkLabel: {
      de: "Persönliche Daten löschen",
    },
  },
  accordion: {
    show: {
      de: "Einblenden",
    },
    hide: {
      de: "Ausblenden",
    },
    accordionItemShow: {
      de: "Einblenden",
    },
    accordionItemHide: {
      de: "Ausblenden",
    },
  },
  feedback: {
    heading: {
      de: "Haben Sie Fragen oder Anmerkungen?",
    },
    content: {
      de: "Diese Seite ist im Aufbau. Schreiben Sie uns an feedback-justiz-services@digitalservice.bund.de, wenn Ihnen etwas fehlt, oder etwas nicht funktioniert. Ihr Feedback trägt dazu bei, Informationen und Gestaltung der Webseite für alle Nutzenden zu verbessern.",
    },
    "yes-rating": {
      de: "Ja",
    },
    "no-rating": {
      de: "Nein",
    },
    "heading-feedback": {
      de: "Was können wir verbessern?",
    },
    "heading-personal-data-feedback": {
      de: "Bitte tragen Sie keine persönlichen Daten ein. Ihr Feedback wird anonym erfasst.",
    },
    "placeholder-feedback": {
      de: "Ihr Feedback...",
    },
    "submit-button-feedback": {
      de: "Abschicken",
    },
    "heading-post-submission": {
      de: "Vielen Dank!",
    },
    "text-post-submission": {
      de: "Wir wollen digitale Justiz-Angebote entwickeln, die für alle Menschen gut funktionieren. Ihre Hilfe ist dabei sehr wichtig. Teilen Sie Ihre Erfahrungen mit uns und testen Sie neue Angebote. [Hier können Sie sich anmelden](/feedback).",
    },
    "success-message": {
      de: "Vielen Dank!",
    },
    "antwort-uebermittelt": {
      de: "Ihre Antwort wurde übermittelt",
    },
    "positive-feedback-question": {
      de: "Was hat Ihnen gefallen? (optional)",
    },
    "negative-feedback-question": {
      de: "Was können wir verbessern? (optional)",
    },
    "feedback-helps": {
      de: "Ihr Feedback hilft uns, diese Seite für alle Nutzenden zu verbessern.",
    },
    "report-problem": {
      de: "Problem melden",
    },
    cancel: {
      de: "Abbrechen",
    },
    "submit-problem": {
      de: "Problem absenden",
    },
    close: {
      de: "Schließen",
    },
    "open-feedback-placeholder": {
      de: "Beschreibung des Problems ...",
    },
  },
  video: {
    "video-thumbnail": {
      de: "Vorschlau für Gebärdensprache",
    },
    "video-aktivieren": {
      de: "Aktivieren",
    },
    "datenschutz-header": {
      de: "Aktivierung erforderlich!",
    },
    datenschutz: {
      de: "Wir weisen Sie darauf hin, dass nach der Aktivierung Daten an Dritte übermittelt werden.",
    },
    "datenschutz-link": {
      de: "Link zum Datenschutz",
    },
  },
  pageHeader: {
    gebaerdensprache: {
      de: "Gebärden&shy;sprache",
    },
    leichtesprache: {
      de: "Leichte Sprache",
    },
    mainNavigationAriaLabel: {
      de: "Hauptmenü",
    },
  },
  navigationMobile: {
    currentArea: {
      de: "Bereich",
    },
    closeMenu: {
      de: "Close menu",
    },
    toggleMenu: {
      de: "Main menu toggle",
    },
  },
  buttonNavigation: {
    backButtonDefaultLabel: {
      de: "Zurück",
    },
    nextButtonDefaultLabel: {
      de: "Weiter",
    },
  },
  vorabcheck: {
    progressBarLabel: {
      de: "Vorab-Check Fortschritt",
    },
  },
  gerichtFinder: {
    streetName: {
      de: "Straße",
    },
    houseNumber: {
      de: "Hausnummer",
    },
    noResultsFound: {
      de: "Kein Eintrag gefunden",
    },
    inputRequired: {
      de: "Dieses Feld muss ausgefüllt werden.",
    },
    invalidHousenumber: {
      de: "Bitte geben Sie eine gültige Hausnummer an.",
    },
  },
} satisfies TranslationRecord;
