import type { ArrayConfigServer } from "~/services/array";
import type { BeratungshilfeFormularUserData } from "../index";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    bankkonten: {
      url: `${prefix}/eigentum/bankkonten/bankkonto`,
      initialInputUrl: "daten",
      statementKey: "hasBankkonto",
      event: "add-bankkonten",
    },
    kraftfahrzeuge: {
      url: `${prefix}/eigentum/kraftfahrzeuge/kraftfahrzeug`,
      initialInputUrl: "arbeitsweg",
      statementKey: "hasKraftfahrzeug",
      event: "add-kraftfahrzeuge",
    },
    geldanlagen: {
      url: `${prefix}/eigentum/geldanlagen/geldanlage`,
      initialInputUrl: "art",
      statementKey: "hasGeldanlage",
      event: "add-geldanlagen",
    },
    grundeigentum: {
      url: `${prefix}/eigentum/grundeigentum/grundeigentum`,
      initialInputUrl: "bewohnt-frage",
      statementKey: "hasGrundeigentum",
      event: "add-grundeigentum",
    },
    wertsachen: {
      url: `${prefix}/eigentum/wertgegenstaende/wertgegenstand`,
      initialInputUrl: "daten",
      statementKey: "hasWertsache",
      event: "add-wertsachen",
    },
    kinder: {
      url: `${prefix}/kinder/kinder`,
      initialInputUrl: `name`,
      statementKey: "hasKinder",
      hiddenFields: ["eigeneEinnahmen", "unterhalt"],
      event: "add-kinder",
    },
    unterhaltszahlungen: {
      url: `${prefix}/andere-unterhaltszahlungen/person`,
      initialInputUrl: "daten",
      statementKey: "hasWeitereUnterhaltszahlungen",
      event: "add-unterhaltszahlungen",
    },
    ausgaben: {
      url: `${prefix}/ausgaben/ausgaben`,
      initialInputUrl: "art",
      statementKey: "hasAusgaben",
      hiddenFields: ["hasZahlungsfrist"],
      event: "add-ausgaben",
    },
  } satisfies Partial<
    Record<keyof BeratungshilfeFormularUserData, ArrayConfigServer>
  >;
}
