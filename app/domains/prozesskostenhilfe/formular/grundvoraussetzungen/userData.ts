import { type pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type ProzesskostenhilfeGrundvoraussetzungenUserData = InferredUserData<
  typeof pkhFormularGrundvoraussetzungenPages
>;
