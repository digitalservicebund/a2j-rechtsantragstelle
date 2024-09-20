import type { KeysOfUnion } from "~/flows/common";
import type { ArrayConfig } from "~/services/array";
import type { ProzesskostenhilfeFormularContext } from "..";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    arbeitsausgaben: {
      url: `${prefix}/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/abzuege/arbeitsausgaben/uebersicht`,
      statementKey: "hasArbeitsausgaben",
      event: "add-arbeitsausgaben",
    },
    ["partnerEinkuenfte.arbeitsausgaben" as any]: {
      url: `${prefix}/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe`,
      initialInputUrl: "partner-daten",
      statementUrl: `/${prefix}/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht`,
      statementKey: "partnerEinkuenfte.hasArbeitsausgaben" as any,
      event: "partner-add-arbeitsausgaben" as any,
    },
    weitereEinkuenfte: {
      url: `${prefix}/einkuenfte/weitere-einkuenfte/einkunft`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/weitere-einkuenfte/uebersicht`,
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
    Record<KeysOfUnion<ProzesskostenhilfeFormularContext>, ArrayConfig>
  >;
}
