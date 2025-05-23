import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const getAntragstellendePersonStrings = (
  context: ProzesskostenhilfeFormularUserData,
) => {
  return {
    unterhaltspflichtigePersonName: `${context.unterhaltspflichtigePerson?.vorname ?? ""} ${context.unterhaltspflichtigePerson?.nachname ?? ""}`,
  };
};
