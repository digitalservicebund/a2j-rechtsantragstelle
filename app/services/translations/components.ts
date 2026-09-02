import { type TranslationRecord } from "./getTranslationByKey";

export const componentsTranslations = {
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
  details: {
    textExample: {
      de: "Textbeispiele",
    },
  },
  select: {
    bothParents: {
      de: "Beide Elternteile",
    },
    parentSelectLabel: {
      de: "Die Person ist ein Kind von ...",
    },
    parentSelectRequired: {
      de: "Bitte wählen Sie eine Person aus",
    },
  },
  iban: {
    bankIdentified: {
      de: "Bank identifiziert",
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
      de: "",
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
      de: "Problem mit dieser Seite melden",
    },
    "problem-gemeldet": {
      de: "Ihr Problem wurde gemeldet",
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
    "validation-error": {
      de: "Bitte treffen Sie eine Auswahl.",
    },
  },
  inlineNotice: {
    warningIcon: {
      de: "Warnung",
    },
    infoIcon: {
      de: "Information",
    },
    errorIcon: {
      de: "Fehler",
    },
    successIcon: {
      de: "Erfolg",
    },
  },
  personSummaryItem: {
    personAliveAtTimeOfDeath: {
      de: "Lebte zum Todeszeitpunkt?",
    },
    personHadChildren: {
      de: "Hatte weitere Kinder?",
    },
  },
} satisfies TranslationRecord;
