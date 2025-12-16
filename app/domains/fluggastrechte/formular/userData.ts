import type { FluggastrechteGrundvoraussetzungenUserData } from "./grundvoraussetzungen/userData";
import type { FluggastrechtePersoenlicheDatenUserData } from "./persoenlicheDaten/userData";
import type { FluggastrechteProzessfuehrungUserData } from "./prozessfuehrung/userData";
import type { FluggastrechteStreitwertKostenUserData } from "./streitwertKosten/userData";
import { type FluggastrechteFlugdatenUserData } from "./flugdaten/userData";

export type FluggastrechteUserData =
  FluggastrechteGrundvoraussetzungenUserData &
    FluggastrechtePersoenlicheDatenUserData &
    FluggastrechteProzessfuehrungUserData &
    FluggastrechteFlugdatenUserData &
    FluggastrechteStreitwertKostenUserData;
