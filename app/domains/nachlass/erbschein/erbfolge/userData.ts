import { type erbfolgePages } from "~/domains/nachlass/erbschein/erbfolge/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type ErbscheinErbfolgeUserData = InferredUserData<typeof erbfolgePages>;
