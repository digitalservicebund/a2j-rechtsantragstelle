import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berHAntragGrundvoraussetzungenPages } from "./pages";

export type BeratungshilfeGrundvoraussetzungenUserData = InferredUserData<
  typeof berHAntragGrundvoraussetzungenPages
>;
