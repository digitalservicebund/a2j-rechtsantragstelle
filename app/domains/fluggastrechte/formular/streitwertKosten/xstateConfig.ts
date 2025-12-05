import { type Config } from "~/services/flow/server/types";
import { streitwertKostenDone } from "./doneFunctions";
import { hasAirlineAddress } from "../../services/airlines/hasAirlineAddress";
import { type FluggastrechteUserData } from "../userData";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const streitwertKostenXstateConfig = {
  id: "streitwert-kosten",
  initial: steps.streitwertKostenGerichtskosten.relative,
  states: {
    [steps.streitwertKostenGerichtskosten.relative]: {
      on: {
        SUBMIT: steps.streitwertKostenAndereKosten.relative,
        BACK: steps.grundvoraussetzungenAmtsgericht.absolute,
      },
    },
    [steps.streitwertKostenAndereKosten.relative]: {
      on: {
        SUBMIT: steps.streitwertKostenProzesszinsen.relative,
        BACK: steps.streitwertKostenGerichtskosten.relative,
      },
    },
    [steps.streitwertKostenProzesszinsen.relative]: {
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
        BACK: steps.streitwertKostenAndereKosten.relative,
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
