import { z } from "zod";

export const beratungshilfeAbgeabe = {
  abgabeArt: z.enum(["online", "download"]),
};

const contextObject = z.object(beratungshilfeAbgeabe).partial();
export type BeratungshilfeAbgabe = z.infer<typeof contextObject>;
