import type { Context } from "~/domains/contexts";
import type { FlowId } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import type { ArrayConfig } from "~/services/array";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import type { CookieHeader } from "~/services/session.server";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";

export const getFormularServerAdditionalData = async (
  array: {
    configuration: Record<string, ArrayConfig> | undefined;
    categories: string[];
    userDataWithPageData: Context;
  },
  migration: {
    currentFlow: Flow;
    flowId: FlowId;
    stepId: string;
    cookie: CookieHeader;
  },
) => {
  const arraySummaryData = getArraySummaryData(
    array.categories,
    array.configuration,
    array.userDataWithPageData,
  );

  const migrationData = await getMigrationData(
    migration.stepId,
    migration.flowId,
    migration.currentFlow,
    migration.cookie,
  );

  return {
    arraySummaryData,
    migrationData,
  };
};
