/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import partition from "lodash/partition";
import { flows } from "~/domains/flows.server";
import { strapiFileSchema, type StrapiSchemas } from "~/services/cms/schemas";
import { type Config } from "~/services/flow/server/buildFlowController";

const contentFilePath = "./content.json";

type MinimalPage = {
  attributes: {
    flow_ids: StrapiSchemas["form-flow-pages"][0]["attributes"]["flow_ids"];
    stepId: StrapiSchemas["form-flow-pages"][0]["attributes"]["stepId"];
  };
};

// recursivly traverse states object, while concatenating nested names. Returns a flat list
function allStateNames(xstateConfigStates: Config["states"]): string[] {
  if (!xstateConfigStates) return [];
  return Object.entries(xstateConfigStates).flatMap(
    ([stateName, stateConfig]) => {
      if (stateConfig.states) {
        // there are nested states -> recursion
        return allStateNames(stateConfig.states).map(
          (subStateName) => stateName + "/" + subStateName,
        );
      } else {
        // stepId in xstate config use ergebnis/ prefix to indicate ErgebnisPage
        return stateName.replace("ergebnis/", "");
      }
    },
  );
}

function urlsFromPages(pages: MinimalPage[]) {
  // A page containing multiple flowIDs results in multiple URLs
  return pages.flatMap((page) =>
    page.attributes.flow_ids.data.map(
      (flowId) => flowId.attributes.flowId + page.attributes.stepId,
    ),
  );
}

function partitionPagesByStepId(pages: MinimalPage[]) {
  return partition(pages, (page) => page.attributes.stepId !== null);
}

function partitionPagesByFlowId(pages: MinimalPage[]) {
  return partition(pages, (page) => page.attributes.flow_ids.data.length > 0);
}

function unusedStrapiEntry() {
  let content: StrapiSchemas | undefined = undefined;
  try {
    content = strapiFileSchema.parse(
      JSON.parse(readFileSync(contentFilePath, "utf-8")),
    );
    console.log("Content imported successfully, scanning...");
  } catch (error) {
    console.error(error);
    console.warn(
      `The previous error occured while trying to read ${contentFilePath}. Did you forget to run 'npm run build:localContent' before?`,
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

    const [pagesWithStepId, pagesWithoutStepId] = partitionPagesByStepId(pages);

    if (pagesWithoutStepId.length > 0) {
      console.warn(`Found ${pagesWithoutStepId.length} pages without stepId!`);
    } else {
      console.log("No entries without stepIds ✅");
    }

    const [, pagesWithoutFlowIds] = partitionPagesByFlowId(pages);

    if (pagesWithoutFlowIds.length > 0) {
      console.warn(
        `Found ${pagesWithoutFlowIds.length} pages without flowIds!`,
      );
    } else {
      console.log("No entries without flowIds ✅");
    }

    const allUrlsFromXstateConfigs = Object.entries(flows).flatMap(
      ([flowId, { config }]) =>
        allStateNames(config.states).map(
          (stateName) => `${flowId}/${stateName}`,
        ),
    );

    const unusedUrls = urlsFromPages(pagesWithStepId).filter(
      (url) => !allUrlsFromXstateConfigs.includes(url),
    );

    console.log(
      `Found ${unusedUrls.length} unused strapi entries with following stepIds: `,
      // eslint-disable-next-line sonarjs/no-misleading-array-reverse, sonarjs/no-alphabetical-sort
      unusedUrls.sort(),
    );
  }
}

if (process.argv[2] === "unusedStrapiEntry") unusedStrapiEntry();
