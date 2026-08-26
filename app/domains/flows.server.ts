import { kontopfaendungWegweiser } from "~/domains/kontopfaendung/wegweiser";
import { beratungshilfeFormular } from "~/domains/beratungshilfe/formular";
import { beratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import type { Config } from "~/services/flow/server/types";
import type { Replacements } from "~/util/applyStringReplacement";
import type { FlowId } from "./flowIds";
import type { Guards } from "./guards.server";
import { prozesskostenhilfeFormular } from "./prozesskostenhilfe/formular";
import type { UserData } from "./userData";
import { geldEinklagenFormular } from "./geldEinklagen/formular";
import { kontopfaendungPkontoAntrag } from "./kontopfaendung/pkonto/antrag";
import { nachlassErbscheinWegweiser } from "~/domains/nachlass/erbschein/wegweiser";
import { nachlassErbscheinNachlassgericht } from "~/domains/nachlass/erbschein/nachlassgericht";
import { type Session } from "react-router";
import { nachlassErbausschlagungAnfrage } from "~/domains/nachlass/erbausschlagung/anfrage";
import { nachlassErbausschlagungGerichtFinden } from "~/domains/nachlass/erbausschlagung/gericht-finden";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import {
  type InferredUserData,
  type PageConfigMap,
} from "~/services/flow/newFlowEngine/types";
import { nachlassErbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";
import { nachlassErbfolge } from "~/domains/nachlass/erbschein/erbfolge";

type MigrationDataMerger<Dest extends PageConfigMap> = (
  sourceData: InferredUserData<PageConfigMap>,
) => InferredUserData<Dest>;

type FlowMigration<C extends PageConfigMap> = {
  source: FlowId;
  sortedFields: string[];
  /**
   * Custom merge function used in cases where source and destination flow have different schemas.
   * @param sourceData userData of the source flow, which is being migrated from
   * @returns merged userData belonging to the destination flow
   */
  migrationDataMerger?: MigrationDataMerger<C>;
  buttonUrl?: string;
};

type FlowMetaConfiguration = {
  excludedFromValidation?: boolean;
  triggerValidation?: boolean;
  shouldAppearAsMenuNavigation?: boolean;
};

export type FlowType = "vorabCheck" | "formFlow";

export type Flow<C extends PageConfigMap = PageConfigMap> = {
  flowType: FlowType;
  config: Config;
  newEngineConfig?: CompiledFlow<C>;
  guards?: Guards;
  migration?: FlowMigration<C>;
  flowTransitionConfig?: FlowTransitionConfig;
  stringReplacements?: (context: UserData) => Replacements;
  asyncFlowActions?: Record<
    string,
    (
      request: Request,
      userData: UserData,
      flowSession: Session,
    ) => Promise<void>
  >;
  useStepper?: boolean;
  metaConfiguration?: Record<string, FlowMetaConfiguration>;
  lifecycleTimeInHours?: number;
};

export const flows = {
  "/beratungshilfe/antrag": beratungshilfeFormular,
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/fluggastrechte/formular": fluggastrechtFlow,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormular,
  "/nachlass/erbschein/wegweiser": nachlassErbscheinWegweiser,
  "/nachlass/erbschein/nachlassgericht": nachlassErbscheinNachlassgericht,
  "/nachlass/erbschein/anfrage": nachlassErbscheinAnfrage,
  "/nachlass/erbausschlagung/anfrage": nachlassErbausschlagungAnfrage,
  "/nachlass/erbausschlagung/gericht-finden":
    nachlassErbausschlagungGerichtFinden,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiser,
  "/geld-einklagen/formular": geldEinklagenFormular,
  "/kontopfaendung/pkonto/antrag": kontopfaendungPkontoAntrag,
  "/nachlass/erbschein/erbfolge": nachlassErbfolge,
} satisfies Record<FlowId, Flow<PageConfigMap>>;
