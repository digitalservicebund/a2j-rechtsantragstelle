import { type FieldApi } from "@rvf/react";
import { type MaybePromise } from "p-map";
import { type Dispatch, type SetStateAction } from "react";
import { geldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { erbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import { erbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { erbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { erbscheinNachlassgerichtPages } from "~/domains/nachlass/erbschein/nachlassgericht/pages";
import { erbscheinWegweiserPages } from "~/domains/nachlass/erbschein/wegweiser/pages";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { type NewFlowEnginePageConfig } from "~/services/flow/newFlowEngine/types";
import { beratungshilfeAntragPages } from "./beratungshilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import { fluggastrechteFormularPages } from "./fluggastrechte/formular/pages";
import { fluggastrechteVorabcheckPages } from "./fluggastrechte/vorabcheck/pages";
import { geldEinklagenFormularPages } from "./geldEinklagen/formular/pages";
import { kontopfaendungPkontoAntragPages } from "./kontopfaendung/pkonto/antrag/pages";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import { erbfolgePages } from "./nachlass/erbschein/erbfolge/pages";
import type { AllowedUserTypes, SchemaObject, UserData } from "./userData";

export const pages: Record<FlowId, PagesConfig> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
  "/beratungshilfe/antrag": beratungshilfeAntragPages,
  "/geld-einklagen/formular": geldEinklagenFormularPages,
  "/geld-einklagen/anwaltschaft": geldEinklagenAnwaltschaftPages,
  "/fluggastrechte/formular": fluggastrechteFormularPages,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckPages,
  "/kontopfaendung/pkonto/antrag": kontopfaendungPkontoAntragPages,
  "/erbschein/wegweiser": erbscheinWegweiserPages,
  "/erbschein/nachlassgericht": erbscheinNachlassgerichtPages,
  "/erbausschlagung/anfrage": erbausschlagungAnfragePages,
  "/erbschein/erbfolge": erbfolgePages,
  "/erbschein/anfrage": erbscheinAnfragePages,
  "/erbausschlagung/gericht-finden": erbausschlagungGerichtFindenPages,
} as const;

export type FormFieldsMap = Record<string, string[]>;

export const getAllPageSchemaByFlowId = (flowId: FlowId) => {
  const pagesConfig = pages[flowId];

  const schemaObjects = Object.values(pagesConfig)
    .filter(({ pageSchema }) => pageSchema !== undefined)
    .map(({ pageSchema }) => pageSchema!);

  return Object.assign({}, ...schemaObjects) as SchemaObject;
};

export const getAllFieldsFromFlowId = (flowId: FlowId): FormFieldsMap => {
  const pagesConfig = pages[flowId];
  const fieldsMap: FormFieldsMap = {};

  for (const page of Object.values(pagesConfig)) {
    if (page.pageSchema) {
      fieldsMap[page.stepId] = Object.keys(page.pageSchema);
    }
  }

  return fieldsMap;
};

export const getPageConfigOrArrayPageByPathname = (pathname: string) => {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) return undefined;

  const { stepId } = parsePathname(pathname);
  const pagesConfig = pages[flowId];

  return Object.values(pagesConfig).find((entry) => entry.stepId === stepId);
};

export function getPageSchema(pathname: string) {
  const pageConfigOrArrayPage = getPageConfigOrArrayPageByPathname(pathname);
  return pageConfigOrArrayPage?.pageSchema;
}

export function getReadOnlyFields(pathname: string) {
  const pageConfigOrArrayPage = getPageConfigOrArrayPageByPathname(pathname);
  return pageConfigOrArrayPage && "readonlyFields" in pageConfigOrArrayPage
    ? pageConfigOrArrayPage.readonlyFields
    : undefined;
}

export type PagesConfig = Record<string, PageConfig>;

type FieldValueChangeHandlerProps = {
  value: AllowedUserTypes;
  originalValue: AllowedUserTypes;
  controlledField: FieldApi<any>;
  setControlledFieldSrValue: Dispatch<SetStateAction<string | undefined>>;
};

export type FieldValueChangeHandler = (
  props: FieldValueChangeHandlerProps,
) => MaybePromise<void | (() => void)>;

export type ControlledFieldConfig = {
  fieldName: string;
  handleFieldValueChange: FieldValueChangeHandler;
  getScreenReaderAnnouncementText: (controlledFieldSrValue: string) => string;
};

export const hasControlledFieldConfig = (
  fieldName: string,
  controlledFieldConfig: ControlledFieldConfig | undefined,
) => {
  return controlledFieldConfig?.fieldName === fieldName;
};

type FlowPage = {
  stepId: string;
  pageSchema?: SchemaObject;
  controlledFieldConfig?: ControlledFieldConfig;
  readonlyFields?: ReadOnlyFields;
};

type ReadOnlyFields = {
  fieldNames: string[];
  shouldMakeReadOnly: (userData: UserData) => boolean;
};

export type ArrayPage = {
  pageSchema?: SchemaObject;
  arrayPages?: Record<string, ArrayPage>;
  controlledFieldConfig?: ControlledFieldConfig;
  readonlyFields?: ReadOnlyFields;
};

type ArrayParentPage = {
  stepId: string;
  pageSchema: SchemaObject;
  controlledFieldConfig?: ControlledFieldConfig;
  arrayPages: Record<string, ArrayPage>;
};

export type PageConfig = FlowPage | ArrayParentPage | NewFlowEnginePageConfig;
