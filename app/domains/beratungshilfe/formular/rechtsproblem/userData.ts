import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berHAntragRechtsproblemPages } from "./pages";

export type BeratungshilfeRechtsproblemUserData = InferredUserData<
  typeof berHAntragRechtsproblemPages
>;
