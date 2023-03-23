import cms from "~/services/cms";

type HeadingContent = {
  id: number;
  __component: "basic.heading";
  text: string;
  size: number;
};

type ParagraphContent = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

type FieldErrorContent = {
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

export type ElementContent =
  | HeadingContent
  | ParagraphContent
  | InputContent
  | SelectContent;

export type PageContent = Record<string, string | ElementContent[]>;

export default async function (
  url: string,
  options?: { dontThrow: boolean }
): Promise<PageContent> {
  const { pathname } = new URL(url);
  const slug = pathname.slice(1);
  console.log({ slug });
  const data = await cms().getPageBySlug(slug);
  console.log({ data });
  if (!data && !options?.dontThrow) {
    throw new Error("No page config found!");
  }
  return data?.attributes;
}
