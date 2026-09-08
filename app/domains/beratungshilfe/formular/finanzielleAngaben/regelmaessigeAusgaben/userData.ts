import { type z } from "zod";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import {
  type ausgabenArraySchema,
  type berhAntragFinanzielleAngabenRegelmassigeAusgabenPages,
} from "./pages";

export type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenRegelmassigeAusgabenPages
  > & {
    ausgaben?: z.infer<typeof ausgabenArraySchema>;
  };
