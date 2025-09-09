import { type Config } from "~/services/flow/server/types";
import { streitwertKostenDone } from "./doneFunctions";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";
import { type FluggastrechteUserData } from "../userData";

export const streitwertKostenXstateConfig = {
  meta: { done: streitwertKostenDone },
  id: "streitwert-kosten",
  initial: "gerichtskosten",
  states: {
    gerichtskosten: {
      on: {
        SUBMIT: "andere-kosten",
        BACK: "#grundvoraussetzungen.amtsgericht",
      },
    },
    "andere-kosten": {
      on: {
        SUBMIT: "prozesszinsen",
        BACK: "gerichtskosten",
      },
    },
    prozesszinsen: {
      on: {
        SUBMIT: [
          {
            target: "#flugdaten.adresse-fluggesellschaft-auswahl",
            guard: ({ context }) =>
              hasAirlineAddress(context.fluggesellschaft ?? "") &&
              streitwertKostenDone({ context }),
          },
          {
            target: "#flugdaten.adresse-fluggesellschaft",
            guard: streitwertKostenDone,
          },
        ],
        BACK: "andere-kosten",
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
