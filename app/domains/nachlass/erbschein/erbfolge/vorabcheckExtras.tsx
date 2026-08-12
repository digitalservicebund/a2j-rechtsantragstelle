import { type ArrayData } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { type Replacements } from "~/util/applyStringReplacement";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import {
  dynamicSelectZodDescription,
  type DynamicOptions,
} from "~/services/validation/dynamicSelect";
import type {
  VorabcheckExtrasContext,
  VorabcheckLoaderExtras,
} from "~/routes/shared/newEngineVorabcheck.server";
import {
  parentSelectFormElement,
  resolveParentOptions,
} from "./buildParentOptions";
import { personName } from "../shared/personName";
import {
  type VorabcheckExtras,
  type VorabcheckExtraLoaderData,
} from "~/domains/extraLoaderConfiguration";
import { ElternteilSummary } from "~/domains/nachlass/erbschein/erbfolge/components/ElternteilSummary";
import { KinderSummary } from "~/domains/nachlass/erbschein/erbfolge/components/KinderSummary";
import { type ArrayConfigClient } from "~/services/array";

type ErbfolgeArraySummaryData = {
  category: string;
  arrayData: {
    data: ArrayData;
    configuration: ArrayConfigClient;
  };
};

type ErbfolgeLoaderExtraData = {
  formElements: StrapiFormComponent[];
  dynamicOptions: DynamicOptions | undefined;
  arraySummaryData: ErbfolgeArraySummaryData | undefined;
  deceasedPersonName: string | undefined;
};

type ErbfolgeLoaderExtras = {
  arraySummaryData:
    | {
        category: string;
        arrayData: {
          data: ArrayData;
          configuration: {
            url: string;
            initialInputUrl: string;
            disableAddButton: boolean;
          };
        };
      }
    | undefined;
  deceasedPersonName: string | undefined;
  dynamicOptions: DynamicOptions | undefined;
};

type ErbfolgeVorabcheckLoaderData = VorabcheckExtraLoaderData &
  ErbfolgeLoaderExtras;

export const erbfolgeExtras: VorabcheckExtras<ErbfolgeVorabcheckLoaderData> = {
  renderExtraComponents: (loaderData) => {
    return (
      <>
        {loaderData.arraySummaryData?.category === "elternteile" && (
          <ElternteilSummary
            data={loaderData.arraySummaryData.arrayData.data}
            configuration={loaderData.arraySummaryData.arrayData.configuration}
            deceasedPersonName={loaderData.deceasedPersonName}
          />
        )}
        {loaderData.arraySummaryData &&
          loaderData.arraySummaryData.category !== "elternteile" && (
            <KinderSummary
              data={loaderData.arraySummaryData.arrayData.data}
              configuration={
                loaderData.arraySummaryData.arrayData.configuration
              }
              category={loaderData.arraySummaryData.category}
              deceasedPersonName={loaderData.deceasedPersonName}
            />
          )}
      </>
    );
  },
  getDynamicOptions: (loaderData) => loaderData.dynamicOptions,
};

// The dynamic parent-select fields (e.g. "which sibling does this child belong
// to") declare their options at runtime rather than in the CMS, marked by a
// sentinel description on their zod schema.
function dynamicSelectFieldsOf(context: VorabcheckExtrasContext) {
  const shape =
    (
      context.flowSessionEngine.pageSchema as {
        shape?: Record<string, unknown>;
      }
    )?.shape ?? {};
  return Object.entries(shape).filter(
    ([, fieldSchema]) =>
      (fieldSchema as { description?: string }).description ===
      dynamicSelectZodDescription,
  );
}

// Ancestor list-item names for the current page, so CMS text can reference the
// specific relative the user is inside (e.g. {{kinder#name}} on a grandchild
// page). The static per-flow replacements can't know this because it depends on
// which array indexes are in the URL.
function buildParentNameReplacements(
  context: VorabcheckExtrasContext,
): Replacements {
  const { fieldNames, arrayInfo } = context.flowSessionEngine;

  const fieldNamesForPage = arrayInfo
    ? [...fieldNames, arrayInfo.name]
    : fieldNames;

  // Array-summary pages have no schema field names of their own, so also take
  // the ancestor names from the array's own name (e.g. kinder#kinder).
  const sourceFields = [
    ...fieldNames,
    ...(arrayInfo?.name.includes("#") ? [arrayInfo.name] : []),
  ];

  const parentNameFields = [
    ...new Set(
      sourceFields
        .filter((fieldName) => fieldName.includes("#"))
        .flatMap((fieldName) => {
          const segments = fieldName.split("#");
          return segments.slice(0, -1).flatMap((_, depth) => {
            const prefix = segments.slice(0, depth + 1).join("#");
            return [`${prefix}#vorname`, `${prefix}#nachname`];
          });
        })
        .filter((fieldName) => !fieldNamesForPage.includes(fieldName)),
    ),
  ];

  if (parentNameFields.length === 0) return {};

  return resolveUserData(context.userData, parentNameFields) as Replacements;
}

function buildDynamicOptions(
  context: VorabcheckExtrasContext,
): DynamicOptions | undefined {
  const dynamicSelectFields = dynamicSelectFieldsOf(context);
  if (dynamicSelectFields.length === 0) return undefined;

  return Object.fromEntries(
    dynamicSelectFields.map(([fieldName]) => [
      fieldName,
      resolveParentOptions(
        fieldName,
        context.userData as Record<string, unknown>,
        context.arrayIndexes ?? [],
      ),
    ]),
  );
}

// Parent-select fields that have no CMS form element yet still need to render,
// so give them a fallback element carrying just the (dynamic) options + label.
function buildParentSelectFallbacks(
  context: VorabcheckExtrasContext,
  formElements: StrapiFormComponent[],
): StrapiFormComponent[] {
  return dynamicSelectFieldsOf(context)
    .filter(
      ([fieldName]) =>
        !formElements.some(
          (element) => "name" in element && element.name === fieldName,
        ),
    )
    .map(([fieldName]) => parentSelectFormElement(fieldName));
}

// The list (of children, siblings, ...) shown on an array overview page. Gated
// on the page actually being an array entry point, matching the flow's own
// reachability rather than a CMS statement field.
function buildArraySummaryData(
  context: VorabcheckExtrasContext,
): ErbfolgeArraySummaryData | undefined {
  const { arrayInfo } = context.flowSessionEngine;
  if (arrayInfo?.entryPoint === undefined) return undefined;

  const arrayData = (resolveUserData(context.userData, [arrayInfo.name])[
    arrayInfo.name
  ] ?? []) as ArrayData;

  return {
    category: arrayInfo.name,
    arrayData: {
      data: arrayData,
      configuration: {
        url:
          context.flowId +
          resolveArrayCharacter(
            context.stepId,
            context.arrayIndexes ?? [],
            false,
          ),
        initialInputUrl: arrayInfo.entryPoint,
        disableAddButton: false,
      },
    },
  };
}

export const erbfolgeVorabcheckLoaderExtras = {
  buildReplacements: buildParentNameReplacements,
  buildLoaderData: (context) => ({
    formElements: [
      ...context.formElements,
      ...buildParentSelectFallbacks(context, context.formElements),
    ],
    dynamicOptions: buildDynamicOptions(context),
    arraySummaryData: buildArraySummaryData(context),
    deceasedPersonName: personName({
      vorname: (context.userData as { verstorbeneVorname?: string })
        .verstorbeneVorname,
      nachname: (context.userData as { verstorbeneNachname?: string })
        .verstorbeneNachname,
    }),
  }),
} satisfies VorabcheckLoaderExtras<ErbfolgeLoaderExtraData>;
