import pick from "lodash/pick";
import { type FlowId } from "~/domains/flowIds";
import { type Flow } from "~/domains/flows.server";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import { getPrunedUserDataFromSimulation } from "~/services/flow/newFlowEngine/pruneUserData";
import {
  type InferredUserData,
  type PageConfigMap,
} from "~/services/flow/newFlowEngine/types";

export const migrateSourceFlowDataToDestinationFlow = <C extends PageConfigMap>(
  sourceUserData: InferredUserData<C>,
  sourceFlow: Flow<C>,
  destinationFlow: Flow<C>,
  destinationFlowId: FlowId,
) => {
  if (destinationFlow.migration?.migrationDataMerger) {
    return destinationFlow.migration.migrationDataMerger(sourceUserData);
  }
  const prunedData = getPrunedUserDataFromSimulation(
    sourceFlow.newEngineConfig!,
    sourceUserData,
  );
  const destinationFieldnames = Object.keys(
    getAllPageSchemaByFlowId(destinationFlowId),
  );

  return pick(prunedData, destinationFieldnames); // we only cares about attributes that also appear in the destination
};
