import { type ErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type ErbscheinAnfrageUserData = InferredUserData<ErbscheinAnfragePages>;
