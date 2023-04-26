import cms from "~/services/cms";
import type { FormComponentCMS } from "./models/formComponents";
import type { VorabcheckPage } from "./models/VorabcheckPage";
import type { Input as InputContent } from "./models/formComponents";
import type { ErrorCategory } from "./models/formComponents";
import type { Page } from "./models/Page";
import type { ResultPage } from "~/services/cms/models/ResultPage";

export type StrapiPage = {
  id: number;
  attributes: VorabcheckPage;
};

export function getInputsContent(content: FormComponentCMS[]) {
  return content.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  content: FormComponentCMS[] = [],
  inputName: string
) {
  const matchingElements = getInputsContent(content).filter(
    (el) => el.name === inputName
  );
  return matchingElements[0] ?? { type: "text", label: inputName };
}

export const flattenErrorCodes = (errors: ErrorCategory[] = []) => {
  return errors.map((e) => e.attributes.errorCodes).flat();
};

export const getVorabCheckPageConfig = async function (
  url: string
): Promise<VorabcheckPage | undefined> {
  const [collection, step] = slugsfromURL(url);
  return await cms().getPageFromCollection(collection, step);
};

export const getResultPageConfig = async (url: string): Promise<ResultPage> => {
  const step = slugsfromURL(url)[1];
  return await cms().getPageFromCollection("resultPage", step);
};

export const slugsfromURL = (url: string) =>
  new URL(url).pathname.slice(1).split("/");

export const getPageConfig = async function (
  page: string,
  options?: { dontThrow: boolean }
): Promise<Page | undefined> {
  const cmsContent = await cms().getPageFromCollection("page", page);
  if (!cmsContent && !options?.dontThrow) {
    throw new Error(`No content for ${page} found!`);
  }
  return cmsContent;
};
