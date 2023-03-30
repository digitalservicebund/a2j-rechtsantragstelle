import cms from "~/services/cms";
import type { FormComponentCMS } from "./models/formComponents";
import type { VorabcheckPage } from "./models/VorabcheckPage";
import type { Input as InputContent } from "./models/formComponents";
import type { ErrorCategory } from "./models/formComponents";

export type StrapiPage = {
  id: number;
  attributes: VorabcheckPage;
};

function getRevelantContent(content: FormComponentCMS[], id: string) {
  return content?.find((page) => "name" in page && page.name === id);
}

export function getRelevantOptions(content: FormComponentCMS[], id: string) {
  const relevantContent = getRevelantContent(content, id);
  return relevantContent && "options" in relevantContent
    ? relevantContent["options"]
    : undefined;
}

export function getInputsContent(content: FormComponentCMS[]) {
  return content.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  content: FormComponentCMS[],
  inputName: string
) {
  return getInputsContent(content).filter(
    (el) => el.name === inputName
  )[0] as InputContent;
}

export const flattenErrorCodes = (errors: ErrorCategory[] = []) => {
  return errors.map((e) => e.attributes.errorCodes).flat();
};

export const getPageConfig = async function (
  url: string,
  options?: { dontThrow: boolean }
): Promise<VorabcheckPage | undefined> {
  const { pathname } = new URL(url);
  const [collection, step] = pathname.slice(1).split("/");
  const cmsContent = await cms().getPageFromCollection(collection, step);
  if (!cmsContent && !options?.dontThrow) {
    throw new Error("No page config found!");
  }
  return cmsContent;
};
