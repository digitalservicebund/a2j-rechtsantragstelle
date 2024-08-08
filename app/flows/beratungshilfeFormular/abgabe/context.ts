import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const beratungshilfeAbgabe = {
  abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
};

const _contextObject = z.object(beratungshilfeAbgabe).partial();
export type BeratungshilfeAbgabe = z.infer<typeof _contextObject>;
