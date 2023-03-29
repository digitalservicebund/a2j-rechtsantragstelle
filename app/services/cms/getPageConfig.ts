import cms from "~/services/cms";
import type { ContentComponent } from "./models/contentComponents";
import type { FormComponent } from "./models/formComponents";
import type { VorabcheckPage } from "./models/VorabcheckPage";
import type { Input as InputContent } from "./models/formComponents";

export type ElementContent = ContentComponent | FormComponent;

export type StrapiPage = {
  id: number;
  attributes: VorabcheckPage;
};

export function getRevelantContent(pageContent: ElementContent[], id: string) {
  return pageContent?.find((page) => "name" in page && page.name === id);
}

export function getRelevantOptions(pageContent: ElementContent[], id: string) {
  const relevantContent = getRevelantContent(pageContent, id);
  return relevantContent && "options" in relevantContent
    ? relevantContent["options"]
    : undefined;
}

export function getInputsContent(pageContent: ElementContent[]) {
  return pageContent.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  pageContent: ElementContent[],
  inputName: string
) {
  return getInputsContent(pageContent).filter(
    (el) => (el.name = inputName)
  )[0] as InputContent;
}

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
