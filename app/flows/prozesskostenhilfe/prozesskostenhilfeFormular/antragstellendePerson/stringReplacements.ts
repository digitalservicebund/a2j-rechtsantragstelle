import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular";

export const getAntragstellendePersonStrings = (
  context: ProzesskostenhilfeFormularContext,
) => {
  return {
    unterhaltspflichtigePersonName: `${context.unterhaltspflichtigePerson?.vorname ?? ""} ${context.unterhaltspflichtigePerson?.nachname ?? ""}`,
  };
};
