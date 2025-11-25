import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { geldEinklagenGerichtPruefenPages } from "../pages";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "../userData";
import { type Config } from "~/services/flow/server/types";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import {
  shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
  shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../gericht-suchen/guards";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const zustaendigesGerichtXstateConfig = {
  id: "zustaendiges-gericht",
  initial: "pilot-gericht",
  states: {
    [steps.zustaendigesGerichtPilotGericht.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context: { postleitzahlSecondary } }) =>
              edgeCasesForPlz(postleitzahlSecondary).length > 0,
            target: steps.gerichtSuchenStrasseNummer.absolute,
          },
          {
            guard: ({ context: { postleitzahlBeklagtePerson } }) =>
              edgeCasesForPlz(postleitzahlBeklagtePerson).length > 0,
            target: steps.gerichtSuchenStrasseNummerBeklagtePerson.absolute,
          },
          {
            guard: shouldVisitGerichtSuchenPostleitzahlWohnraum,
            target: steps.gerichtSuchenPostleitzahlWohnraum.absolute,
          },
          {
            guard: ({ context }) =>
              context.gerichtsstandsvereinbarung === "yes",
            target:
              steps.gerichtSuchenPostleitzahlGerichtsstandsvereinbarung
                .absolute,
          },
          {
            guard: shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
            target: steps.gerichtSuchenPostleitzahlKlagendePerson.absolute,
          },
          {
            guard: shouldVisitGerichtSuchenPostleitzahlVerkehrsunfall,
            target: steps.gerichtSuchenPostleitzahlVerkehrsunfall.absolute,
          },
          {
            guard: ({ context }) => context.sachgebiet === "schaden",
            target: steps.gerichtSuchenPostleitzahlUnerlaubtePerson.absolute,
          },
          {
            target: steps.gerichtSuchenPostleitzahlBeklagtePerson.absolute,
          },
        ],
      },
    },
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
