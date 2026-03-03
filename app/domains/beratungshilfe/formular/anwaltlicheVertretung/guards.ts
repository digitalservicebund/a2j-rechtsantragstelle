import type { BeratungshilfeAnwaltlicheVertretungUserData } from "./userData";
import type { Guards } from "~/domains/guards.server";
import { addDays, dateUTCFromGermanDateString, today } from "~/util/date";

export const beratungshilfeAnwaltlicheVertretungGuards = {
  anwaltskanzleiYes: ({ context }) => context.anwaltskanzlei === "yes",
  beratungStattgefundenYes: ({ context }) =>
    context.beratungStattgefunden === "yes",
  beratungStattgefundenWithinFourWeeks: ({
    context: { beratungStattgefundenDatum },
  }) => {
    if (!beratungStattgefundenDatum) return false;
    const beratungDate = dateUTCFromGermanDateString(
      beratungStattgefundenDatum,
    );
    return addDays(beratungDate, 28) > today();
  },
} satisfies Guards<BeratungshilfeAnwaltlicheVertretungUserData>;
