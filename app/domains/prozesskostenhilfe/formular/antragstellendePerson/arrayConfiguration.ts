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
    vermoegen: {
      url: `${prefix}/vereinfachte-erklaerung/vermoegen-eintrag`,
      initialInputUrl: "daten",
      statementKey: "vermoegenUnder10000",
      event: "add-vermoegen",
    },
  } satisfies Partial<
    Record<
      keyof ProzesskostenhilfeAntragstellendePersonUserData,
      ArrayConfigServer
    >
  >;
}
