import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type pkhFormularAbgabePages } from "~/domains/prozesskostenhilfe/formular/abgabe/pages";

export type ProzesskostenhilfeAbgabeUserData = InferredUserData<
  typeof pkhFormularAbgabePages
>;
