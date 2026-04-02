import type z from "zod";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./gericht-pruefen/userData";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./klage-erstellen/userData";
import type { sachgebietSchema } from "./gericht-pruefen/pages";
import type { PageData } from "~/services/flow/pageDataSchema";

export type GeldEinklagenFormularUserData =
  GeldEinklagenFormularGerichtPruefenUserData &
    GeldEinklagenFormularKlageErstellenUserData & { pageData?: PageData };

export type GeldEinklagenSachgebietType = z.infer<typeof sachgebietSchema>;
