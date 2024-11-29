import type { AllContextKeys } from "~/domains/common";
import type { ArrayConfigFlow } from "~/services/array";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    bankkonten: {
      url: `${prefix}/eigentum-zusammenfassung/bankkonten`,
      initialInputUrl: "daten",
      statementKey: "hasBankkonto",
      event: "add-bankkonten",
    },
    kraftfahrzeuge: {
      url: `${prefix}/eigentum-zusammenfassung/kraftfahrzeuge`,
      initialInputUrl: "arbeitsweg",
      statementKey: "hasKraftfahrzeug",
      event: "add-kraftfahrzeuge",
    },
    geldanlagen: {
      url: `${prefix}/eigentum-zusammenfassung/geldanlagen`,
      initialInputUrl: "art",
      statementKey: "hasGeldanlage",
      event: "add-geldanlagen",
    },
    grundeigentum: {
      url: `${prefix}/eigentum-zusammenfassung/grundeigentum`,
      initialInputUrl: "bewohnt-frage",
      statementKey: "hasGrundeigentum",
      event: "add-grundeigentum",
    },
    wertsachen: {
      url: `${prefix}/eigentum-zusammenfassung/wertgegenstaende`,
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
  } satisfies Partial<Record<AllContextKeys, ArrayConfigFlow>>;
}
