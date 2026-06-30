import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../userData";
import { geldEinklagenFlowConfig } from "../flowConfig";
import { geldEinklagenFormular } from "..";
import { testCasesWithUserInputIntroForderung } from "../gericht-pruefen/__test__/testCasesWithUserInput";
import { testCasesWithUserInputSachgebiet } from "../gericht-pruefen/sachgebiet/__test__/testCasesWithUserInput";
import { testCasesWithUserInputKlagendePerson } from "../gericht-pruefen/klagendePerson/__test__/testCasesWithUserInput";
import { testCasesWithUserInputBeklagtePerson } from "../gericht-pruefen/beklagtePerson/__test__/testCasesWithUserInput";
import { testCasesWithUserInputGerichtSuchenMiete } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenMiete";
import { testCasesWithUserInputGerichtSuchenSchaden } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenSchaden";
import { testCasesWithUserInputGerichtSuchenVersicherung } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenVersicherung";
import { testCasesWithUserInputGerichtSuchenVerkehrsunfall } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenVerkehrsunfall";
import { testCasesWithUserInputGerichtSuchenUrheberrecht } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenUrheberrecht";
import { testCasesWithUserInputGerichtSuchenReisenAnderesRechtsproblem } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenReisenAnderesRechtsproblem";
import { testCasesWithUserInputGerichtSuchenEdgeCases } from "../gericht-pruefen/gericht-suchen/__test__/testCasesWithUserInputGerichtSuchenEdgeCasesZipCode";
import { testCasesWithUserInputZustaendigesGericht } from "../gericht-pruefen/zustaendiges-gericht/__test__/testCasesWithUserInput";

export const geldEinklagenFormularTestCases = {
  xstateConfig: geldEinklagenFormular.config,
  newEngineConfig: geldEinklagenFlowConfig,
  testcases: {
    ...testCasesWithUserInputIntroForderung,
    ...testCasesWithUserInputSachgebiet,
    ...testCasesWithUserInputKlagendePerson,
    ...testCasesWithUserInputBeklagtePerson,
    ...testCasesWithUserInputGerichtSuchenMiete,
    ...testCasesWithUserInputGerichtSuchenSchaden,
    ...testCasesWithUserInputGerichtSuchenVersicherung,
    ...testCasesWithUserInputGerichtSuchenVerkehrsunfall,
    ...testCasesWithUserInputGerichtSuchenUrheberrecht,
    ...testCasesWithUserInputGerichtSuchenReisenAnderesRechtsproblem,
    ...testCasesWithUserInputGerichtSuchenEdgeCases,
    ...testCasesWithUserInputZustaendigesGericht,
  },
} satisfies FlowTestConfig<
  GeldEinklagenFormularUserData,
  typeof geldEinklagenFlowConfig.pages
>;
