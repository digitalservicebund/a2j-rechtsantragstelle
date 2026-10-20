import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type kontopfaendungWegweiserPages } from "./pages";
export type KontopfaendungWegweiserUserData = InferredUserData<
  typeof kontopfaendungWegweiserPages
>;
