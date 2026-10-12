import type { BeratungshilfeAnwaltlicheVertretungUserData } from "./userData";
import type { Guards } from "~/domains/guards.server";
import { toDate } from "~/services/validation/dateObject";
import { addDays, today } from "~/util/date";

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiYes: ({ context }) => context.anwaltskanzlei === "yes",
  beratungStattgefundenYes: ({ context }) =>
    context.beratungStattgefunden === "yes",
  beratungStattgefundenWithinFourWeeks: ({
    context: { beratungStattgefundenDatum },
  }) => {
    if (!beratungStattgefundenDatum) return false;
    const beratungDate = toDate(beratungStattgefundenDatum);
    return addDays(beratungDate, 28) > today();
  },
} satisfies Guards<BeratungshilfeAnwaltlicheVertretungUserData>;
