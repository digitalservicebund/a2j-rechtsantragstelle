import { z } from "zod";
import { getContext } from "~/domains/contexts";
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

/**
 * These pages do not exist in strapi and instead exist in our own codebase
 */
const ignoreList = [
  "redirect-vorabcheck-ergebnis",
  "partner-start",
  "abschluss",
  "unterhalt", // antragstellende person unterhalt
];

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

function compileAllStrapiPages(flowId: FlowId) {
  const {
    "vorab-check-pages": vorabCheckPages,
    "form-flow-pages": formFlowPages,
    "result-pages": resultPages,
  } = allStrapiData[flowId];
  return [...formFlowPages, ...resultPages, ...vorabCheckPages]
    .filter((page) => page.attributes.locale === defaultLocale)
    .map((page) => page.attributes.stepId);
}

/**
 * Helper Function to recursively retrieve all keys from a zod schema
 * @param schema Zod schema to traverse
 * @returns array of string keys
 * @example zodKeys(
 *            z.object({
 *              a: z.string(),
 *              b: z.number(),
 *              c: z.object({ d: z.string() }),
 *              e: z.array({ f: z.string() })
 *          })) => ['a', 'b', 'c.d', 'e#f']
 */
const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
  // make sure schema is not null or undefined
  if (schema === null || schema === undefined) return [];
  // check if schema is nullable or optional
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap());
  // check if schema is an array
  if (schema instanceof z.ZodArray) {
    return zodKeys(schema.element);
  }
  // check if schema is a ZodEffect
  if (schema instanceof z.ZodEffects) {
    return zodKeys(schema._def?.schema ?? schema);
  }
  // check if schema is an object
  if (schema instanceof z.ZodObject) {
    // get key/value pairs from schema
    const entries = Object.entries(schema.shape);
    // loop through key/value pairs
    return entries.flatMap(([key, value]) => {
      // get nested keys
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value).map(
              (subKey) =>
                `${key}${value instanceof z.ZodArray ? "#" : "."}${subKey}`,
            )
          : [];
      // return nested keys
      return nested.length ? nested : key;
    });
  }
  // return empty array
  return [];
};

function invertStrapiFormFields(formFields: FormFieldsMap) {
  return Object.entries(formFields)
    .map(([key, values]) => values.map((value) => [value, key]))
    .flat();
}

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

describe.each(flowIds)("Availability of %s content", (flowId: FlowId) => {
  describe("pages", () => {
    test(`all states that are referenced in the ${flowId} xState config are available in Strapi`, () => {
      const pages = compileAllStrapiPages(flowId);

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
      const pages = compileAllStrapiPages(flowId);
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

      allContextFields.forEach((fieldName) => {
        let currentPageName = "";
        const strapiContainsField = strapiFormFieldsInverted.some(
          // eslint-disable-next-line sonarjs/no-nested-functions
          ([strapiFieldName, pageName]) => {
            currentPageName = pageName;
            return strapiFieldName === fieldName;
          },
        );
        assert(
          strapiContainsField,
          `expected Strapi page ${currentPageName} to contain ${fieldName} in ${flowId} context`,
        );
      });
    });
  });
});
