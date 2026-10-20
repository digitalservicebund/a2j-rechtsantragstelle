import { type FluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type FluggastrechteUserData =
  InferredUserData<FluggastrechteFormularPages>;
