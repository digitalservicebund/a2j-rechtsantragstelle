import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berHAntragWeitereAngabenPages } from "./pages";

export type BeratungshilfeWeitereAngabenUserData = InferredUserData<
  typeof berHAntragWeitereAngabenPages
>;
