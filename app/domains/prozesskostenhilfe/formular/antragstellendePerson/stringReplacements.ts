import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";

export const getAntragstellendePersonStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    unterhaltspflichtigePersonName: `${context.unterhaltspflichtigePerson?.vorname ?? ""} ${context.unterhaltspflichtigePerson?.nachname ?? ""}`,
  };
};
