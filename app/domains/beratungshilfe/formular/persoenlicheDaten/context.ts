import { z } from "zod";
import {
  persoenlicheDaten,
  geburtsdatum,
} from "~/domains/shared/formular/persoenlicheDaten/context";

export const beratungshilfePersoenlicheDaten = {
  ...persoenlicheDaten,
  geburtsdatum,
};

const _contextObject = z.object(beratungshilfePersoenlicheDaten).partial();
export type BeratungshilfePersoenlicheDaten = z.infer<typeof _contextObject>;
