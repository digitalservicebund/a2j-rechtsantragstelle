import { type z } from "zod";
import { type InferredUserData } from "~/services/flow/flowEngine/types";
import type {
  ankuendigungSchema,
  fluggastBereichSchema,
  fluggastrechteVorabcheckPages,
} from "./pages";

export type FluggastrechtVorabcheckUserData = InferredUserData<
  typeof fluggastrechteVorabcheckPages
>;

export type FluggastrechtBereichType = z.infer<typeof fluggastBereichSchema>;
export type FluggastrechtAnkuendigungType = z.infer<typeof ankuendigungSchema>;
