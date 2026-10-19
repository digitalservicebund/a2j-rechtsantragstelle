import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berHAntragGrundvoraussetzungenPages } from "./pages";

export type BeratungshilfeGrundvoraussetzungenUserData = InferredUserData<
  typeof berHAntragGrundvoraussetzungenPages
>;
