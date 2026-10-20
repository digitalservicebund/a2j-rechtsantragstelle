import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berHAntragRechtsproblemPages } from "./pages";

export type BeratungshilfeRechtsproblemUserData = InferredUserData<
  typeof berHAntragRechtsproblemPages
>;
