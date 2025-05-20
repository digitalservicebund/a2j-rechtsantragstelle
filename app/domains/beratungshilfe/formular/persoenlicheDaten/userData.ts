import omit from "lodash/omit";
import { z } from "zod";
import {
  persoenlicheDaten,
  geburtsdatum,
} from "~/domains/shared/formular/persoenlicheDaten/context";

export const beratungshilfePersoenlicheDatenInputSchema = {
  ...omit(persoenlicheDaten, ["title"]),
  geburtsdatum,
};

const _partialSchema = z.object(beratungshilfePersoenlicheDatenInputSchema).partial();
export type BeratungshilfePersoenlicheDatenUserData = z.infer<typeof _partialSchema>;
