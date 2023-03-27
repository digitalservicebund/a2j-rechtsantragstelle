import cms from "~/services/cms";
import type { ContentComponent } from "./models/contentComponents";
import type { FormComponent } from "./models/formComponents";
import type { VorabcheckPage } from "./models/VorabcheckPage";

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

export const getPageConfig = async function (
  url: string,
  options?: { dontThrow: boolean }
): Promise<VorabcheckPage> {
  const { pathname } = new URL(url);
  const [collection, step] = pathname.slice(1).split("/");
  const data = await cms().getPageFromCollection(collection, step);
  if (!data && !options?.dontThrow) {
    throw new Error("No page config found!");
  }
  return data;
};
