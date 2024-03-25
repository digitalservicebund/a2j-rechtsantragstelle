import type { ArrayConfig } from "~/services/array";
import type { BeratungshilfeFinanzielleAngaben } from "./context";

const prefix = "/beratungshilfe/antrag/finanzielleAngaben";

export const finanzielleAngabenArrayConfig = {
  bankkonten: {
    url: `${prefix}/besitzZusammenfassung/bankkonten`,
    initialInputUrl: "daten",
    questionUrl: `${prefix}/besitz/bankkonten-frage`,
    statementKey: "hasBankkonto",
    event: "add-bankkonten",
  },
  kraftfahrzeuge: {
    url: `${prefix}/besitzZusammenfassung/kraftfahrzeuge`,
    initialInputUrl: "daten",
    questionUrl: `${prefix}/besitz/kraftfahrzeuge-frage`,
    statementKey: "hasKraftfahrzeug",
    event: "add-kraftfahrzeuge",
  },
  geldanlagen: {
    url: `${prefix}/besitzZusammenfassung/geldanlagen`,
    initialInputUrl: "daten",
    questionUrl: `${prefix}/besitz/geldanlagen-frage`,
    statementKey: "hasGeldanlage",
    event: "add-geldanlagen",
  },
  grundeigentum: {
    url: `${prefix}/besitzZusammenfassung/grundeigentum`,
    initialInputUrl: "bewohnt-frage",
    questionUrl: `${prefix}/besitz/grundeigentum-frage`,
    statementKey: "hasGrundeigentum",
    event: "add-grundeigentum",
  },
  wertsachen: {
    url: `${prefix}/besitzZusammenfassung/wertgegenstaende`,
    initialInputUrl: "daten",
    questionUrl: `${prefix}/besitz/wertgegenstaende-frage`,
    statementKey: "hasWertsache",
    event: "add-wertsachen",
  },
  kinder: {
    url: `${prefix}/kinder/kinder`,
    initialInputUrl: `name`,
    questionUrl: `${prefix}/kinder/kinder-frage`,
    statementKey: "hasKinder",
    hiddenFields: ["eigeneEinnahmen", "unterhalt"],
    event: "add-kinder",
  },
} satisfies Partial<
  Record<keyof BeratungshilfeFinanzielleAngaben, ArrayConfig>
>;
