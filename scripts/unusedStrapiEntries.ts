/* oxlint-disable no-console */
import { readFileSync } from "node:fs";
import partition from "lodash/partition";
import { flows } from "~/domains/flows.server";
import {
  strapiFileSchema,
  type StrapiSchemasOutput,
  type StrapiSchemas,
} from "~/services/cms/schemas";
const contentFilePath = "./content.json";

type MinimalPage = {
  flow_ids: StrapiSchemas["form-flow-pages"][0]["flow_ids"];
  stepId: StrapiSchemas["form-flow-pages"][0]["stepId"];
};

function urlsFromPages(pages: MinimalPage[]) {
  // A page containing multiple flowIDs results in multiple URLs
  return pages.flatMap((page) =>
    page.flow_ids.map((flowId) => flowId.flowId + page.stepId),
  );
}

function partitionPagesByFlowId(pages: MinimalPage[]) {
  return partition(pages, (page) => page.flow_ids.length > 0);
}

export default async function unusedStrapiEntry() {
  let content: StrapiSchemasOutput | undefined = undefined;
  try {
    content = await strapiFileSchema.parseAsync(
      JSON.parse(readFileSync(contentFilePath, "utf-8")),
    );
    console.log("Content imported successfully, scanning...");
  } catch (error) {
    console.error(error);
    console.warn(
      `The previous error occured while trying to read ${contentFilePath}. Did you forget to run 'pnpm run build:localContent' before?`,
    );
    process.exit(1);
  }

  const apiIds = [
    "form-flow-pages",
    "vorab-check-pages",
    "result-pages",
  ] as const;

  for (const apiId of apiIds) {
    console.log(`\nChecking ${apiId}:`);
    const pages = content[apiId];

    const [, pagesWithoutFlowIds] = partitionPagesByFlowId(pages);

    if (pagesWithoutFlowIds.length > 0) {
      console.warn(
        `Found ${pagesWithoutFlowIds.length} pages without flowIds!`,
      );
    } else {
      console.log("No entries without flowIds ✅");
    }

    // oxlint-disable-next-line prefer-set-has
    const allUrlsFromFlows = Object.entries(flows).flatMap(
      ([flowId, { newEngineConfig }]) =>
        Object.values(newEngineConfig?.pages ?? {}).map(
          (page) => `${flowId}${page.stepId}`,
        ),
    );

    const unusedUrls = urlsFromPages(pages).filter(
      (url) => !allUrlsFromFlows.includes(url),
    );

    console.log(
      `Found ${unusedUrls.length} unused strapi entries with following stepIds: `,
      unusedUrls.toSorted(),
    );
  }
}
