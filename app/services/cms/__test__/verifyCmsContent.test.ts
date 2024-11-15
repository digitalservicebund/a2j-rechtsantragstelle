import { z } from "zod";
import type { FlowId } from "~/domains/flowIds";
import { flowIds } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import { flows } from "~/domains/flows.server";
import type { FormFieldsMap } from "~/services/cms/fetchAllFormFields";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { getStrapiEntry } from "~/services/cms/getStrapiEntry";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import type { StrapiSchemas } from "~/services/cms/schemas";
import { flowPageSchemas } from "~/services/cms/schemas";

const _flowPageSchemas = z.object(flowPageSchemas);
type FlowPageSchemas = z.infer<typeof _flowPageSchemas>;
type StrapiPages = FlowPageSchemas & { formFields: FormFieldsMap };

const allStrapiData: Record<FlowId, StrapiPages> = {} as Record<
  FlowId,
  StrapiPages
>;

expect.extend({
  toBeInXStateConfig(received, expected) {
    if (received === expected) {
      return {
        pass: true,
        message: () => `expected ${received} not to be in ${expected}`,
      };
    } else {
      return {
        pass: true,
        message: () => `expected ${received} to be in ${expected}`,
      };
    }
  },
});

/**
 * These pages do not exist in strapi and instead exist in our own codebase
 */
const ignoreList = ["redirect-vorabcheck-ergebnis"];

function getAllPossibleStates(flow: Flow) {
  const allPossibleStates: string[] = [];

  function _getAllPossibleStates(
    states: Flow["config"]["states"],
    path: string,
  ) {
    for (const state in states) {
      if (ignoreList.includes(state)) continue;
      if (!states[state].initial) {
        allPossibleStates.push(`${path}/${state.replace(/^ergebnis\//, "")}`);
      }
      if (states[state].states) {
        _getAllPossibleStates(
          states[state].states,
          `${path}/${state.replace(/^ergebnis\//, "")}`,
        );
      }
    }
  }

  _getAllPossibleStates(flow.config.states, "");

  return allPossibleStates;
}

beforeAll(async () => {
  for (const flowId of flowIds) {
    const [vorabCheckPages, resultPages, formFlowPages, formFields] =
      await Promise.all([
        getStrapiEntry({
          apiId: "vorab-check-pages",
          locale: "all",
          filters: [
            { value: flowId, field: "flow_ids", nestedField: "flowId" },
          ],
        }),
        getStrapiEntry({
          apiId: "result-pages",
          locale: "all",
          filters: [
            { value: flowId, field: "flow_ids", nestedField: "flowId" },
          ],
        }),
        getStrapiEntry({
          apiId: "form-flow-pages",
          locale: "all",
          filters: [
            { value: flowId, field: "flow_ids", nestedField: "flowId" },
          ],
        }),
        fetchAllFormFields(flowId),
      ]);

    allStrapiData[flowId] = {
      "vorab-check-pages":
        vorabCheckPages[0] === null
          ? []
          : (vorabCheckPages as StrapiSchemas["vorab-check-pages"]),
      "result-pages":
        resultPages[0] === null
          ? []
          : (resultPages as StrapiSchemas["result-pages"]),
      "form-flow-pages":
        formFlowPages[0] === null
          ? []
          : (formFlowPages as StrapiSchemas["form-flow-pages"]),
      formFields,
    };
  }
});

describe.each(flowIds)("Availability of CMS content", (flowId) => {
  test.skip("all vorabcheck pages mentioned in the app are available in the CMS", () => {
    for (const vorabcheckId of flowIds.filter((flowId) =>
      flowId.includes("vorabcheck"),
    )) {
      const { config } = flows[vorabcheckId];
      const referencedPages = Object.keys(config.states).map((pageName) =>
        pageName.replace(/^ergebnis\//, ""),
      );
      const {
        "vorab-check-pages": vorabCheckPages,
        "result-pages": resultPages,
        "form-flow-pages": formFlowPages,
      } = allStrapiData[vorabcheckId];
      const allPages = [...vorabCheckPages, ...resultPages, ...formFlowPages]
        .filter((page) => page.attributes.locale === defaultLocale)
        .map((page) => page.attributes.stepId?.replace("/", ""));
      referencedPages.forEach((reference) => {
        expect(
          allPages,
          `missing page: '${reference}' for flowId: ${vorabcheckId}`,
        ).toContain(reference);
      });
    }
  });

  test(`all states that are referenced in the ${flowId} xState config are available in Strapi`, () => {
    // const context = getContext("/beratungshilfe/antrag");
    const {
      // formFields: strapiFormFields,
      "vorab-check-pages": vorabCheckPages,
      "form-flow-pages": formFlowPages,
      "result-pages": resultPages,
    } = allStrapiData[flowId];
    // const strapiFormFieldsInverted = Object.entries(strapiFormFields)
    //   .map(([key, values]) => values.map((value) => [value, key]))
    //   .flat();

    const flow = flows[flowId];
    const allPossibleStates = getAllPossibleStates(flow);
    allPossibleStates.forEach((stateName) => {
      const pages = [...formFlowPages, ...resultPages, ...vorabCheckPages]
        .filter((page) => page.attributes.locale === defaultLocale)
        .map((page) => page.attributes.stepId);
      expect(pages).toContain(stateName);
    });

    // check xstate for all mentioned strapi fields
    // strapiFormFieldsInverted.forEach(([fieldName, stepId]) => {
    //   if (!fieldName.includes(".") && !fieldName.includes("#")) {
    //     expect(
    //       context,
    //       `expected ${stepId} to contain ${fieldName}`,
    //     ).toHaveProperty(fieldName);
    //   }
    // });
  });

  test.skip(`all pages in strapi related to ${flowId} also appear in the xState config`, () => {});

  test.skip(`all field names appearing in strapi related to ${flowId} appear in the context`, () => {});

  test.skip(`all field names appearing in the ${flowId} xState config appear in the context`, () => {});
});
