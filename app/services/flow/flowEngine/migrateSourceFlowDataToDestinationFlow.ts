import pick from "lodash/pick";
import { type FlowId } from "~/domains/flowIds";
import { type Flow } from "~/domains/flows.server";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import { getPrunedUserDataFromSimulation } from "~/services/flow/flowEngine/pruneUserData";
import {
  type InferredUserData,
  type PagesConfig,
} from "~/services/flow/flowEngine/types";

export const migrateSourceFlowDataToDestinationFlow = <C extends PagesConfig>(
  sourceUserData: InferredUserData<C>,
  sourceFlow: Flow<C>,
  destinationFlow: Flow<C>,
  destinationFlowId: FlowId,
) => {
  if (destinationFlow.migration?.migrationDataMerger) {
    return destinationFlow.migration.migrationDataMerger(sourceUserData);
  }
  const prunedData = getPrunedUserDataFromSimulation(
    sourceFlow.config!,
    sourceUserData,
  );
  const destinationFieldnames = Object.keys(
    getAllPageSchemaByFlowId(destinationFlowId),
  );

  return pick(prunedData, destinationFieldnames); // we only cares about attributes that also appear in the destination
};
