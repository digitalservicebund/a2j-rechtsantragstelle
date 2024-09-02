import type { AllContextKeys } from "~/flows/common";
import type { ArrayConfig } from "~/services/array";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    arbeitsausgaben: {
      url: `${prefix}/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/abzuege/arbeitsausgaben/uebersicht`,
      statementKey: "hasArbeitsausgaben",
      event: "add-arbeitsausgaben",
    },
    weitereEinkuenfte: {
      url: `${prefix}/einkuenfte/weitere-einkuenfte/einkunft`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/weitere-einkuenfte/uebersicht`,
      statementKey: "hasFurtherIncome",
      event: "add-weitereEinkuenfte",
    },
  } satisfies Partial<Record<AllContextKeys, ArrayConfig>>;
}
