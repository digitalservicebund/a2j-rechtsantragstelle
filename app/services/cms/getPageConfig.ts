import cms from "~/services/cms";

type HeadingContent = {
  id: number;
  __component: "basic.heading";
  text: string;
  level: number;
};

type ParagraphContent = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

export type FieldErrorContent = {
  code: string;
  text: string;
};

export type InputContent = {
  id: number;
  __component: "form-elements.input";
  name: string;
  label?: string;
  type: "text" | "number";
  errors: FieldErrorContent[];
};

type SelectOptionContent = {
  id: number;
  text: string;
  value: string;
};

export type SelectContent = {
  id: number;
  __component: "form-elements.select";
  name: string;
  label?: string;
  options: SelectOptionContent[];
};

type PreFormContent = HeadingContent | ParagraphContent;

type FormContent = InputContent | SelectContent;

export type ElementContent =
  | HeadingContent
  | ParagraphContent
  | InputContent
  | SelectContent;

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
  pre_form: PreFormContent[];
  form: FormContent[];
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
