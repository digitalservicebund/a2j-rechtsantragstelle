import type { KeysOfUnion } from "~/domains/common";
import type { ArrayConfigFlow } from "~/services/array";
import type { BeratungshilfeFormularContext } from "../index";

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
    Record<KeysOfUnion<BeratungshilfeFormularContext>, ArrayConfigFlow>
  >;
}
