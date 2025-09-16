import { z } from "zod";
import type { FlowId } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import type { FormFieldsMap } from "~/services/cms/fetchAllFormFields";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { flowPageSchemas } from "~/services/cms/schemas";

const _flowPageSchemas = z.object(flowPageSchemas);
type FlowPageSchemas = z.infer<typeof _flowPageSchemas>;
type StrapiPages = FlowPageSchemas & { formFields: FormFieldsMap };
export type AllStrapiData = Record<FlowId, StrapiPages>;

/**
 * These pages do not exist in strapi and instead exist in our own codebase
 */
export const ignoreList = ["redirect-vorabcheck-ergebnis", "abschluss"];

export function compileAllStrapiPages(
  flowId: FlowId,
  allStrapiData: AllStrapiData,
) {
  const {
    "vorab-check-pages": vorabCheckPages,
    "form-flow-pages": formFlowPages,
    "result-pages": resultPages,
  } = allStrapiData[flowId];
  return [...formFlowPages, ...resultPages, ...vorabCheckPages]
    .filter((page) => page.locale === defaultLocale)
    .map((page) => page.stepId);
}

/**
 * Helper Function to recursively retrieve all keys from a zod schema
 * Massive if branching is needed, as Zod has different ways of encoding
 * a schema's keys for each data type
 */
export function zodKeys<T extends z.ZodType | null | undefined>(
  schema: T,
): string[] {
  if (!schema) return [];
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional)
    return zodKeys(schema.unwrap() as z.ZodType); // unwrap returns z.core.$ZodType instead of z.ZodType
  if (schema instanceof z.ZodArray) {
    return zodKeys(schema.element as z.ZodType);
  }
  if (schema instanceof z.ZodObject) {
    //  loop through shape to get nested keys
    // eslint-disable-next-line sonarjs/function-return-type
    return Object.entries(schema.shape).flatMap(([key, value]) => {
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value).map(
              (subKey) =>
                `${key}${value instanceof z.ZodArray ? "#" : "."}${subKey}`,
            )
          : [];
      return nested.length ? nested : key;
    });
  }
  return [];
}

export function getAllPossibleStates(flow: Flow) {
  const allPossibleStates: string[] = [];

  function _getAllPossibleStates(
    states: Flow["config"]["states"],
    path: string,
  ) {
    for (const state in states) {
      if (ignoreList.includes(state)) continue;
      const stateString = `${path}/${state.replace(/^ergebnis\//, "")}`;
      if (!states[state].initial) {
        allPossibleStates.push(stateString);
      }
      if (states[state].states) {
        _getAllPossibleStates(states[state].states, stateString);
      }
    }
  }

  _getAllPossibleStates(flow.config.states, "");

  return allPossibleStates;
}

export function invertStrapiFormFields(formFields: FormFieldsMap) {
  return Object.entries(formFields)
    .map(([key, values]) => values.map((value) => [value, key]))
    .flat();
}
