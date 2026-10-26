import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berHAntragPersoenlicheDatenPages } from "./pages";

export type BeratungshilfePersoenlicheDatenUserData = InferredUserData<
  typeof berHAntragPersoenlicheDatenPages
>;
