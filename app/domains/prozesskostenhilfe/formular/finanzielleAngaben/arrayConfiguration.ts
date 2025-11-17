import type { ArrayConfigServer } from "~/services/array";
import type { ProzesskostenhilfeFormularUserData } from "../userData";

const prefix = "/prozesskostenhilfe/formular/finanzielle-angaben";

export const finanzielleAngabenArrayConfig = {
  bankkonten: {
    url: `${prefix}/eigentum/bankkonten/bankkonto`,
    initialInputUrl: "daten",
    statementKey: "hasBankkonto",
    event: "add-bankkonten",
  },
  geldanlagen: {
    url: `${prefix}/eigentum/geldanlagen/geldanlage`,
    initialInputUrl: "art",
    statementKey: "hasGeldanlage",
    event: "add-geldanlagen",
  },
  kraftfahrzeuge: {
    url: `${prefix}/eigentum/kraftfahrzeuge/kraftfahrzeug`,
    initialInputUrl: "arbeitsweg",
    statementKey: "hasKraftfahrzeug",
    event: "add-kraftfahrzeuge",
  },
  wertsachen: {
    url: `${prefix}/eigentum/wertgegenstaende/wertgegenstand`,
    initialInputUrl: "daten",
    statementKey: "hasWertsache",
    event: "add-wertsachen",
  },
  grundeigentum: {
    url: `${prefix}/eigentum/grundeigentum/grundeigentum`,
    initialInputUrl: "bewohnt-frage",
    statementKey: "hasGrundeigentum",
    event: "add-grundeigentum",
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
  arbeitsausgaben: {
    url: `${prefix}/abzuege/arbeitsausgaben/arbeitsausgabe`,
    initialInputUrl: "daten",
    statementKey: "hasArbeitsausgaben",
    event: "add-arbeitsausgaben",
  },
  "partner-arbeitsausgaben": {
    url: `${prefix}/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe`,
    initialInputUrl: "partner-daten",
    statementKey: "partner-hasArbeitsausgaben",
    event: "add-partner-arbeitsausgaben",
  },
  "partner-weitereEinkuenfte": {
    url: `${prefix}/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft`,
    initialInputUrl: "partner-daten",
    statementKey: "partner-hasFurtherIncome",
    event: "add-partner-weitereEinkuenfte",
  },
  weitereEinkuenfte: {
    url: `${prefix}/einkuenfte/weitere-einkuenfte/einkunft`,
    initialInputUrl: "daten",
    statementKey: "hasFurtherIncome",
    event: "add-weitereEinkuenfte",
  },
  versicherungen: {
    url: `${prefix}/ausgaben/versicherungen`,
    initialInputUrl: "daten",
    statementKey: "hasAusgaben",
    event: "add-versicherungen",
  },
  ratenzahlungen: {
    url: `${prefix}/ausgaben/ratenzahlungen`,
    initialInputUrl: "daten",
    statementKey: "hasAusgaben",
    hiddenFields: ["zahlungspflichtiger"],
    event: "add-ratenzahlungen",
  },
  sonstigeAusgaben: {
    url: `${prefix}/ausgaben/sonstigeAusgaben`,
    initialInputUrl: "daten",
    statementKey: "hasAusgaben",
    hiddenFields: ["zahlungspflichtiger"],
    event: "add-sonstigeAusgaben",
  },
} satisfies Partial<
  Record<keyof ProzesskostenhilfeFormularUserData, ArrayConfigServer>
>;
