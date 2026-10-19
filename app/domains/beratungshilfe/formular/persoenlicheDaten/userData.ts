import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berHAntragPersoenlicheDatenPages } from "./pages";

export type BeratungshilfePersoenlicheDatenUserData = InferredUserData<
  typeof berHAntragPersoenlicheDatenPages
>;
