import type { ArrayConfig } from "~/services/array";
import type { BeratungshilfeFinanzielleAngaben } from "./context";

const prefix = "/beratungshilfe/antrag/finanzielleAngaben";

export const finanzielleAngabenArrayConfig = {
  bankkonten: {
    url: `${prefix}/besitzZusammenfassung/bankkonten`,
    initialInputUrl: "daten",
    statementUrl: `${prefix}/besitz/bankkonten-frage`,
    statementKey: "hasBankkonto",
    event: "add-bankkonten",
  },
  kraftfahrzeuge: {
    url: `${prefix}/besitzZusammenfassung/kraftfahrzeuge`,
    initialInputUrl: "arbeitsweg",
    statementUrl: `${prefix}/besitz/kraftfahrzeuge-frage`,
    statementKey: "hasKraftfahrzeug",
    event: "add-kraftfahrzeuge",
  },
  geldanlagen: {
    url: `${prefix}/besitzZusammenfassung/geldanlagen`,
    initialInputUrl: "art",
    statementUrl: `${prefix}/besitz/geldanlagen-frage`,
    statementKey: "hasGeldanlage",
    event: "add-geldanlagen",
  },
  grundeigentum: {
    url: `${prefix}/besitzZusammenfassung/grundeigentum`,
    initialInputUrl: "bewohnt-frage",
    statementUrl: `${prefix}/besitz/grundeigentum-frage`,
    statementKey: "hasGrundeigentum",
    event: "add-grundeigentum",
  },
  wertsachen: {
    url: `${prefix}/besitzZusammenfassung/wertgegenstaende`,
    initialInputUrl: "daten",
    statementUrl: `${prefix}/besitz/wertgegenstaende-frage`,
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
    event: "add-ausgaben",
  },
} satisfies Partial<
  Record<keyof BeratungshilfeFinanzielleAngaben, ArrayConfig>
>;
