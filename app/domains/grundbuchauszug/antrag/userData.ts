import type { InferredUserData } from "~/services/flow/flowEngine/types";
import type { grundbuchauszugAntragPages } from "./pages";

export type GrundbuchauszugAntragUserData = InferredUserData<
  typeof grundbuchauszugAntragPages
>;
