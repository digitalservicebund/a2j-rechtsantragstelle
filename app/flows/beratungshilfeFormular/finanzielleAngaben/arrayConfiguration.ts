import type { KeysOfUnion } from "~/flows/common";
import type { ArrayConfig } from "~/services/array";
import type { BeratungshilfeFormularContext } from "..";

export function finanzielleAngabenArrayConfig(prefix: string) {
  return {
    ausgaben: {
      url: `${prefix}/ausgaben/ausgaben`,
      initialInputUrl: "art",
      statementKey: "hasAusgaben",
      hiddenFields: ["hasZahlungsfrist"],
      event: "add-ausgaben",
    },
  } satisfies Partial<
    Record<KeysOfUnion<BeratungshilfeFormularContext>, ArrayConfig>
  >;
}
