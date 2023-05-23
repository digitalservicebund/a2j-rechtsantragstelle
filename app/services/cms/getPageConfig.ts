import cms from "~/services/cms";
import type { FormComponentCms } from "./models/FormComponentCms";
import type { VorabcheckPage } from "./models/VorabcheckPage";
import type { Input as InputContent } from "./models/Input";
import type { ErrorCategory } from "./models/ErrorCategory";
import type { Page } from "./models/Page";
import type { ResultPage } from "~/services/cms/models/ResultPage";

export type StrapiPage = {
  id: number;
  attributes: VorabcheckPage;
};

export function getInputsContent(content: FormComponentCms[]) {
  return content.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  content: FormComponentCms[] = [],
  inputName: string
) {
  const matchingElements = getInputsContent(content).filter(
    (el) => el.name === inputName
  );
  return matchingElements[0] ?? { type: "text", label: inputName };
}

export const flattenErrorCodes = (
  errors: { attributes: ErrorCategory }[] = []
) => {
  return errors.map((e) => e.attributes.errorCodes).flat();
};

export const getVorabCheckPageConfig = async function (
  url: string
): Promise<VorabcheckPage | undefined> {
  const [collection, step] = slugsfromURL(url);
  return await cms().getPageFromCollection(collection, step);
};

export const getResultPageConfig = async (url: string): Promise<ResultPage> => {
  let step = slugsfromURL(url)[1];

  if (/AbschlussJa/.test(step)) {
    step = "abschlussJa";
  } else if (/AbschlussNein/.test(step)) {
    step = "abschlussNein";
  } else if (/AbschlussVielleicht/.test(step)) {
    step = "abschlussVielleicht";
  }

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
