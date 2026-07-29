import pick from "lodash/pick";
import { type FlowId } from "~/domains/flowIds";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import { type UserData } from "~/domains/userData";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

export const migrateSourceFlowDataToDestinationFlow = (
  sourceUserData: UserData,
  sourceNewEngineConfig: CompiledFlow<PageConfigMap>,
  migrationFlowIdDestination: FlowId,
) => {
  const prunedData = createFlowSession(
    sourceNewEngineConfig,
    sourceUserData,
    "/ergebnis/erbfolge",
  ).prunedUserData;
  const destinationFieldnames = Object.keys(
    getAllPageSchemaByFlowId(migrationFlowIdDestination),
  );

  return pick(prunedData, destinationFieldnames); // we only cares about attributes that also appear in the destination
};
