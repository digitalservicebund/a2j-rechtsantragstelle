import type { KeysOfUnion } from "~/domains/common";
import type { ArrayConfigServer } from "~/services/array";
import type { ProzesskostenhilfeFormularContext } from "../index";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    arbeitsausgaben: {
      url: `${prefix}/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe`,
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
      url: `${prefix}/ausgaben-zusammenfassung/versicherungen`,
      initialInputUrl: "daten",
      statementKey: "hasAusgaben",
      event: "add-versicherungen",
    },
    ratenzahlungen: {
      url: `${prefix}/ausgaben-zusammenfassung/ratenzahlungen`,
      initialInputUrl: "daten",
      statementKey: "hasAusgaben",
      hiddenFields: ["zahlungspflichtiger"],
      event: "add-ratenzahlungen",
    },
    sonstigeAusgaben: {
      url: `${prefix}/ausgaben-zusammenfassung/sonstigeAusgaben`,
      initialInputUrl: "daten",
      statementKey: "hasAusgaben",
      hiddenFields: ["zahlungspflichtiger"],
      event: "add-sonstigeAusgaben",
    },
  } satisfies Partial<
    Record<KeysOfUnion<ProzesskostenhilfeFormularContext>, ArrayConfigServer>
  >;
}
