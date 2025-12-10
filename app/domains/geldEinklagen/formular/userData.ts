import { type GeldEinklagenFormularGerichtPruefenUserData } from "./gericht-pruefen/userData";
import { type GeldEinklagenFormularKlageErstellenUserData } from "./klage-erstellen/userData";

export type GeldEinklagenFormularUserData =
  GeldEinklagenFormularGerichtPruefenUserData &
    GeldEinklagenFormularKlageErstellenUserData;
