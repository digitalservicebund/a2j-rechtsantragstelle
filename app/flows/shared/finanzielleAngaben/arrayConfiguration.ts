import type { AllContextKeys } from "~/flows/common";
import type { ArrayConfig } from "~/services/array";

// TODO: split this up into shared / BerH / PKH
export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    bankkonten: {
      url: `${prefix}/eigentum-zusammenfassung/bankkonten`,
      initialInputUrl: "daten",
      statementUrl: `${prefix}/eigentum/bankkonten-frage`,
      statementKey: "hasBankkonto",
      event: "add-bankkonten",
    },
    kraftfahrzeuge: {
      url: `${prefix}/eigentum-zusammenfassung/kraftfahrzeuge`,
      initialInputUrl: "arbeitsweg",
      statementUrl: `${prefix}/eigentum/kraftfahrzeuge-frage`,
      statementKey: "hasKraftfahrzeug",
      event: "add-kraftfahrzeuge",
    },
    geldanlagen: {
      url: `${prefix}/eigentum-zusammenfassung/geldanlagen`,
      initialInputUrl: "art",
      statementUrl: `${prefix}/eigentum/geldanlagen-frage`,
      statementKey: "hasGeldanlage",
      event: "add-geldanlagen",
    },
    grundeigentum: {
      url: `${prefix}/eigentum-zusammenfassung/grundeigentum`,
      initialInputUrl: "bewohnt-frage",
      statementUrl: `${prefix}/eigentum/grundeigentum-frage`,
      statementKey: "hasGrundeigentum",
      event: "add-grundeigentum",
    },
    wertsachen: {
      url: `${prefix}/eigentum-zusammenfassung/wertgegenstaende`,
      initialInputUrl: "daten",
      statementUrl: `${prefix}/eigentum/wertgegenstaende-frage`,
      statementKey: "hasWertsache",
      event: "add-wertsachen",
    },
    kinder: {
      url: `${prefix}/kinder/kinder`,
      initialInputUrl: `name`,
      statementUrl: `${prefix}/kinder/kinder-frage`,
      statementKey: "hasKinder",
      hiddenFields: ["eigeneEinnahmen", "unterhalt"],
      event: "add-kinder",
    },
    unterhaltszahlungen: {
      url: `${prefix}/andere-unterhaltszahlungen/person`,
      initialInputUrl: "daten",
      statementUrl: `${prefix}/andere-unterhaltszahlungen/frage`,
      statementKey: "hasWeitereUnterhaltszahlungen",
      event: "add-unterhaltszahlungen",
    },
    ausgaben: {
      url: `${prefix}/ausgaben/ausgaben`,
      initialInputUrl: "art",
      statementUrl: `${prefix}/ausgaben/ausgaben-frage`,
      statementKey: "hasAusgaben",
      hiddenFields: ["hasZahlungsfrist"],
      event: "add-ausgaben",
    },
    versicherungen: {
      url: `${prefix}/ausgaben-zusammenfassung/versicherungen`,
      statementKey: "hasAusgaben",
      initialInputUrl: "daten",
      event: "add-versicherungen",
    },
    ratenzahlungen: {
      url: `${prefix}/ausgaben-zusammenfassung/ratenzahlungen`,
      statementKey: "hasAusgaben",
      initialInputUrl: "daten",
      hiddenFields: ["zahlungspflichtiger", "betragGemeinsamerAnteil"],
      event: "add-ratenzahlungen",
    },
    sonstigeAusgaben: {
      url: `${prefix}/ausgaben-zusammenfassung/sonstigeAusgaben`,
      initialInputUrl: "daten",
      statementKey: "hasAusgaben",
      hiddenFields: ["zahlungspflichtiger", "betragGemeinsamerAnteil"],
      event: "add-sonstigeAusgaben",
    },
  } satisfies Partial<Record<AllContextKeys, ArrayConfig>>;
}
