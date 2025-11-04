import { type z } from "zod";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import type {
  ankuendigungSchema,
  fluggastBereichSchema,
  fluggastrechteVorabcheckPages,
} from "./pages";

export type FluggastrechtVorabcheckUserData = UserDataFromPagesSchema<
  typeof fluggastrechteVorabcheckPages
>;

export type FluggastrechtBereichType = z.infer<typeof fluggastBereichSchema>;
export type FluggastrechtAnkuendigungType = z.infer<typeof ankuendigungSchema>;
