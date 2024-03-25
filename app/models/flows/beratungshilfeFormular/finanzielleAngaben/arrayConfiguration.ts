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
    initialInputUrl: "daten",
    statementUrl: `${prefix}/besitz/kraftfahrzeuge-frage`,
    statementKey: "hasKraftfahrzeug",
    event: "add-kraftfahrzeuge",
  },
  geldanlagen: {
    url: `${prefix}/besitzZusammenfassung/geldanlagen`,
    initialInputUrl: "daten",
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
    event: "add-wertgegenstaende",
  },
  kinder: {
    url: `${prefix}/kinder/kinder`,
    initialInputUrl: `name`,
    statementUrl: `${prefix}/kinder/kinder-frage`,
    statementKey: "hasKinder",
    hiddenFields: ["eigeneEinnahmen", "unterhalt"],
    event: "add-kinder",
  },
} satisfies Partial<
  Record<keyof BeratungshilfeFinanzielleAngaben, ArrayConfig>
>;
