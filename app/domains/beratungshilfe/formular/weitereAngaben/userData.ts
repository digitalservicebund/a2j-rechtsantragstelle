import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berHAntragWeitereAngabenPages } from "./pages";

export type BeratungshilfeWeitereAngabenUserData = InferredUserData<
  typeof berHAntragWeitereAngabenPages
>;
