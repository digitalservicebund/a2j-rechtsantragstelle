import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berHAntragAbgabePages } from "./pages";

export type BeratungshilfeAbgabeUserData = InferredUserData<
  typeof berHAntragAbgabePages
>;
