import { type z } from "zod";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import {
  type berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages,
  type unterhaltszahlungenArraySchema,
} from "./pages";

export type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages
  > & {
    unterhaltszahlungen?: z.infer<typeof unterhaltszahlungenArraySchema>;
  };
