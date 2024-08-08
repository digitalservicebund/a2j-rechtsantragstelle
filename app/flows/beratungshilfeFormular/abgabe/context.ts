import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const beratungshilfeAbgeabe = {
  abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
};

const _contextObject = z.object(beratungshilfeAbgeabe).partial();
export type BeratungshilfeAbgabe = z.infer<typeof _contextObject>;
