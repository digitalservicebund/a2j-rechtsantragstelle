import type { ArrayConfigServer } from "~/services/array";
import type { BeratungshilfeFormularUserData } from "../userData";

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
    Record<keyof BeratungshilfeFormularUserData, ArrayConfigServer>
  >;
}
