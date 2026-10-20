import { type pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type ProzesskostenhilfeGrundvoraussetzungenUserData = InferredUserData<
  typeof pkhFormularGrundvoraussetzungenPages
>;
