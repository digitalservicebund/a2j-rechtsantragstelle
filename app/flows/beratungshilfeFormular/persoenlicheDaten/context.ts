import { z } from "zod";
import { persoenlicheDaten } from "~/flows/shared/persoenlicheDaten/context";
import { createDateSchema } from "~/services/validation/date";
import { addYears, today } from "~/util/date";

export const beratungshilfePersoenlicheDaten = {
  ...persoenlicheDaten,
  geburtsdatum: createDateSchema({
    earliest: () => addYears(today(), -150),
    latest: () => today(),
  }).optional(),
};

const _contextObject = z.object(beratungshilfePersoenlicheDaten).partial();
export type BeratungshilfePersoenlicheDaten = z.infer<typeof _contextObject>;
