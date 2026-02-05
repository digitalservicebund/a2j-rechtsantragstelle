import type z from "zod";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./gericht-pruefen/userData";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./klage-erstellen/userData";
import type { sachgebietSchema } from "./gericht-pruefen/pages";

export type GeldEinklagenFormularUserData =
  GeldEinklagenFormularGerichtPruefenUserData &
    GeldEinklagenFormularKlageErstellenUserData;

export type GeldEinklagenSachgebietType = z.infer<typeof sachgebietSchema>;
