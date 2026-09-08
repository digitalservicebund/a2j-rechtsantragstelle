import { type z } from "zod";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import {
  type bankkontenArraySchema,
  type berhAntragFinanzielleAngabenEigentumPages,
  type geldanlagenArraySchema,
  type grundeigentumArraySchema,
  type kraftfahrzeugeArraySchema,
  type wertsachenArraySchema,
} from "./pages";

export type BeratungshilfeFinanzielleAngabenEigentumUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenEigentumPages> & {
    bankkonten?: z.infer<typeof bankkontenArraySchema>;
    geldanlagen?: z.infer<typeof geldanlagenArraySchema>;
    kraftfahrzeuge?: z.infer<typeof kraftfahrzeugeArraySchema>;
    wertsachen?: z.infer<typeof wertsachenArraySchema>;
    grundeigentum?: z.infer<typeof grundeigentumArraySchema>;
  };
