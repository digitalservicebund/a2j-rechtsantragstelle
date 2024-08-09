import { z } from "zod";
import { beratungshilfeAbgabe } from "~/flows/beratungshilfeFormular/abgabe/context";

const _contextObject = z.object(beratungshilfeAbgabe).partial();
export type ProzesskostenhilfeAbgabe = z.infer<typeof _contextObject>;
