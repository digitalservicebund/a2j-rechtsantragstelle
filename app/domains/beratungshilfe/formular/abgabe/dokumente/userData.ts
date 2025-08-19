import { type z } from "zod";
import { type berHAntragDokumentePages } from "./pages";

export type BeratungshilfeAbgabeDokumenteUserData = z.infer<
  typeof berHAntragDokumentePages
>;
