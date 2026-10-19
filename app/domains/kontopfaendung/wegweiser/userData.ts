import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type kontopfaendungWegweiserPages } from "./pages";
export type KontopfaendungWegweiserUserData = InferredUserData<
  typeof kontopfaendungWegweiserPages
>;
