import cms from "~/services/cms";
import type { ContentComponent } from "./models/contentComponents";
import type { FormComponent } from "./models/formComponents";

export type ElementContent = ContentComponent | FormComponent;

export type PageContent = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    id: number;
    title: string;
  };
  content: ElementContent[];
};

export type VorabCheckPageContent = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: ContentComponent[];
  form: FormComponent[];
};

export type StrapiPage = {
  id: number;
  attributes: PageContent | VorabCheckPageContent;
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
): Promise<PageContent | VorabCheckPageContent> {
  const { pathname } = new URL(url);
  const slug = pathname.slice(1);
  const data = await cms().getPageBySlug(slug);
  if (!data && !options?.dontThrow) {
    throw new Error("No page config found!");
  }
  return data;
};
