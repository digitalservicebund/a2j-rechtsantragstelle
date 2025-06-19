import { type FlowId } from "~/domains/flowIds";
import { type Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { getArrayCategoriesFromPageContent } from "~/services/array/getArrayCategoriesFromPageContent";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { isStrapiSelectComponent } from "~/services/cms/models/isStrapiSelectComponent";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import { type StrapiMeta } from "~/services/cms/models/StrapiMeta";
import { type CMSContent } from "~/services/flow/formular/buildFormularServerTranslations";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { stepMeta } from "~/services/meta/formStepMeta";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";

type ContentParameters = {
  cmsContent: CMSContent;
  metaContent: StrapiMeta | null;
  formPageContent: StrapiFormFlowPage;
  stringTranslations: Translations;
  translations: Record<string, Translations>;
};

type FlowParameters = {
  currentFlow: Flow;
  flowId: FlowId;
};

export const getContentData = (
  {
    cmsContent,
    formPageContent,
    metaContent,
    stringTranslations,
    translations,
  }: ContentParameters,
  userDataWithPageData: UserData & {
    pageData: {
      arrayIndexes: number[];
    };
  },
  { currentFlow, flowId }: FlowParameters,
) => {
  return {
    arraySummaryData: (
      flowController: ReturnType<typeof buildFlowController>,
    ) => {
      const arrayCategories =
        getArrayCategoriesFromPageContent(formPageContent);

      return getArraySummaryData(
        arrayCategories,
        flowController.getRootMeta()?.arrays,
        userDataWithPageData,
      );
    },
    getFormElements: () => {
      return cmsContent.formContent.map((strapiFormElement) => {
        if (
          isStrapiSelectComponent(strapiFormElement) &&
          strapiFormElement.label === null &&
          cmsContent.heading !== undefined
        )
          strapiFormElement.altLabel = cmsContent.heading;
        return strapiFormElement;
      });
    },
    getMeta: () => {
      const stringReplacements =
        "stringReplacements" in currentFlow &&
        typeof currentFlow.stringReplacements === "function"
          ? currentFlow.stringReplacements(userDataWithPageData)
          : undefined;

      const meta = applyStringReplacement(
        stepMeta(formPageContent.pageMeta, metaContent),
        stringReplacements,
      );

      return meta;
    },
    getStringTranslations: () => {
      return stringTranslations;
    },
    getCMSContent: () => {
      return cmsContent;
    },
    getStepData: () => {
      const fieldNames = cmsContent.formContent.map((entry) => entry.name);
      return fieldsFromContext(userDataWithPageData, fieldNames);
    },
    getButtonNavigationProps: (
      flowController: ReturnType<typeof buildFlowController>,
      pathname: string,
      stepId: string,
      arrayIndexes: number[] | undefined = [],
    ) => {
      const backDestination = flowController.getPrevious(stepId);

      const backDestinationWithArrayIndexes =
        backDestination && arrayIndexes
          ? insertIndexesIntoPath(pathname, backDestination, arrayIndexes)
          : backDestination;

      const defaultStrings = translations.defaultTranslations;

      return getButtonNavigationProps({
        backButtonLabel:
          cmsContent.backButtonLabel ?? defaultStrings.backButtonDefaultLabel,
        nextButtonLabel:
          cmsContent.nextButtonLabel ?? defaultStrings.nextButtonDefaultLabel,
        isFinal: flowController.isFinal(stepId),
        backDestination: backDestinationWithArrayIndexes,
      });
    },
    getNavItems: (
      flowController: ReturnType<typeof buildFlowController>,
      stepId: string,
    ) => {
      return (
        navItemsFromStepStates(
          stepId,
          flowController.stepStates(),
          translations[`${flowId}/menu`],
        ) ?? []
      );
    },
  };
};
