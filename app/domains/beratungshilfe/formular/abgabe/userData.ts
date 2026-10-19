import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berHAntragAbgabePages } from "./pages";

export type BeratungshilfeAbgabeUserData = InferredUserData<
  typeof berHAntragAbgabePages
>;
