import { z } from "zod";
import type { AllStrapiData } from "tests/integration/util";
import {
  compileAllStrapiPages,
  getAllPossibleStates,
  invertStrapiFormFields,
  zodKeys,
} from "tests/integration/util";
import { getContext } from "~/domains/contexts";
import type { FlowId } from "~/domains/flowIds";
import { flowIds } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { getStrapiEntry } from "~/services/cms/getStrapiEntry";
import type { StrapiSchemas } from "~/services/cms/schemas";

const allStrapiData: AllStrapiData = {} as AllStrapiData;

expect.extend({
  toContainStrapiPage(
    received: {
      flowId: FlowId;
      allPossibleStates: string[];
    },
    strapiPage: string,
  ) {
    const { flowId, allPossibleStates } = received;
    if (allPossibleStates.includes(strapiPage)) {
      return {
        pass: true,
        message: () => `expected ${flowId} not to be in ${strapiPage}`,
      };
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Unused strapi entry ${strapiPage} found for ${flowId}`);
      return {
        pass: true,
        message: () => `expected ${flowId} to be in ${strapiPage}`,
      };
    }
  },
});

beforeAll(async () => {
  for (const flowId of flowIds) {
    const [vorabCheckPages, resultPages, formFlowPages, formFields] =
      await Promise.all([
        getStrapiEntry({
          apiId: "vorab-check-pages",
          locale: "de",
          filters: [
            { value: flowId, field: "flow_ids", nestedField: "flowId" },
          ],
        }),
        getStrapiEntry({
          apiId: "result-pages",
          locale: "de",
          filters: [
            { value: flowId, field: "flow_ids", nestedField: "flowId" },
          ],
        }),
        getStrapiEntry({
          apiId: "form-flow-pages",
          locale: "de",
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

describe.each(flowIds)("Availability of %s content", (flowId: FlowId) => {
  describe("pages", () => {
    test(`all states that are referenced in the ${flowId} xState config are available in Strapi`, () => {
      const pages = compileAllStrapiPages(flowId, allStrapiData);

      const flow = flows[flowId];
      const allPossibleStates = getAllPossibleStates(flow);
      allPossibleStates.forEach((stateName) => {
        assert(
          pages.includes(stateName),
          `expected Strapi to contain an entry for ${stateName} in ${flowId}`,
        );
      });
    });

    test(`all pages in strapi related to ${flowId} also appear in the xState config`, () => {
      const pages = compileAllStrapiPages(flowId, allStrapiData);
      const flow = flows[flowId];
      const allPossibleStates = getAllPossibleStates(flow);
      pages.forEach((strapiPage) => {
        expect({ flowId, allPossibleStates }).toContainStrapiPage(strapiPage);
      });
    });
  });

  describe("field names", () => {
    test(`all field names appearing in strapi related to ${flowId} appear in the context`, () => {
      const context = getContext(flowId);
      const { formFields: strapiFormFields } = allStrapiData[flowId];
      const strapiFormFieldsInverted = invertStrapiFormFields(strapiFormFields);
      const allPossibleStates = getAllPossibleStates(flows[flowId]);

      const allContextFields = zodKeys(z.object(context));

      strapiFormFieldsInverted
        // Filter out unused Strapi entries
        .filter(([, page]) => allPossibleStates.includes(page))
        .forEach(([fieldName, page]) => {
          assert(
            allContextFields.includes(fieldName),
            `expected context for page ${page} to contain ${fieldName} in ${flowId}`,
          );
        });
    });

    test(`all field names appearing in the ${flowId} context also appear in Strapi`, () => {
      const context = getContext(flowId);
      const { formFields: strapiFormFields } = allStrapiData[flowId];
      const strapiFormFieldsInverted = invertStrapiFormFields(strapiFormFields);
      const allContextFields = zodKeys(z.object(context));

      allContextFields
        .filter((fieldName) => !fieldName.includes("pageData"))
        .forEach((fieldName) => {
          const strapiContainsField = strapiFormFieldsInverted.some(
            // eslint-disable-next-line sonarjs/no-nested-functions
            ([strapiFieldName]) => {
              return strapiFieldName === fieldName;
            },
          );
          assert(
            strapiContainsField,
            `expected a Strapi page to contain ${fieldName} in ${flowId} context`,
          );
        });
    });
  });
});
