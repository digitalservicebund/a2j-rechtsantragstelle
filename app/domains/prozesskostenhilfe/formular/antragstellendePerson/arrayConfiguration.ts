import { type ProzesskostenhilfeAntragstellendePersonUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/userData";
import { type ArrayConfigServer } from "~/services/array";

export function antragstellendePersonArrayConfig(prefix: string) {
  return {
    einnahmen: {
      url: `${prefix}/vereinfachte-erklaerung/einnahme`,
      initialInputUrl: "daten",
      statementKey: "hasEinnahmen",
      event: "add-einnahmen",
    },
  } satisfies Partial<
    Record<
      keyof ProzesskostenhilfeAntragstellendePersonUserData,
      ArrayConfigServer
    >
  >;
}
