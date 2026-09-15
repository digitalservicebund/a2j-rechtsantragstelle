import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import {
  type berhAntragFinanzielleAngabenKinderPages,
  type KinderArraySchema,
} from "./pages";

// The `kinder` array is stored under its arraySummary name at runtime; the page
// schemas only carry the per-field "kinder#..." keys, so the array field itself
// is declared explicitly here.
export type BeratungshilfeFinanzielleAngabenKinderUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenKinderPages> & {
    kinder?: KinderArraySchema[];
  };
