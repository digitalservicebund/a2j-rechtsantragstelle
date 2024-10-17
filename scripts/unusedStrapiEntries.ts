/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import _ from "lodash";
import { flows } from "~/flows/flows.server";
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
  return _.partition(pages, (page) => page.attributes.stepId !== null);
}

async function unusedStrapiEntry() {
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

  const pages = [
    ...content["form-flow-pages"],
    ...content["vorab-check-pages"],
    ...content["result-pages"],
  ];

  const [pagesWithStepId, pagesWithoutStepId] = partitionPagesByStepId(pages);

  if (pagesWithoutStepId.length > 0) {
    console.warn(`Found ${pagesWithoutStepId.length} pages without stepId:`);
    pagesWithoutStepId.forEach((page) => {
      console.warn(
        "FlowIds: ",
        page.attributes.flow_ids.data.map((flowId) => flowId.attributes.flowId),
        page,
      );
    });
  }

  const allUrlsFromXstateConfigs = Object.entries(flows).flatMap(
    ([flowId, { config }]) =>
      allStateNames(config.states).map((stateName) => `${flowId}/${stateName}`),
  );

  const unusedUrls = urlsFromPages(pagesWithStepId).filter(
    (url) => !allUrlsFromXstateConfigs.includes(url),
  );

  console.log(`Found ${unusedUrls.length} unused strapi entries: `, unusedUrls);
}

if (process.argv[2] === "unusedStrapiEntry") unusedStrapiEntry();
