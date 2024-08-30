import type { AllContexts } from "~/flows/common";
import type { ArrayConfig } from "~/services/array";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    arbeitsausgaben: {
      url: `${prefix}/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/abzuege/arbeitsausgaben/uebersicht`,
      statementKey: "showAlways",
      event: "add-arbeitsausgaben",
    },
    weitereEinkuenfte: {
      url: `${prefix}/einkuenfte/weitere-einkuenfte/einkunft`,
      initialInputUrl: "daten",
      statementUrl: `/${prefix}/einkuenfte/weitere-einkuenfte/uebersicht`,
      statementKey: "showAlways",
      event: "add-einkunft",
    },
  } satisfies Partial<Record<keyof AllContexts, ArrayConfig>>;
}
