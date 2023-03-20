import cms from "~/services/cms";

type HeadingContent = {
  id: number;
  __component: "basic.header";
  text: string;
  size: number;
};

type ParagraphContent = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

type SelectOptionContent = {
  id: number;
  text: string;
  value: string;
};

export type SelectContent = {
  id: number;
  __component: "basic.select";
  name: string;
  label?: string;
  options: SelectOptionContent[];
};

export type ElementContent = HeadingContent | ParagraphContent | SelectContent;
export type PageContent = Array<ElementContent>;

export default async function (
  request: Request,
  options?: { dontThrow: boolean }
): Promise<PageContent> {
  const { pathname } = new URL(request.url);
  const slug = pathname.slice(1);
  console.log({ slug });
  const data = await cms().getPageBySlug(slug);
  console.log({ data });
  if (!data && !options?.dontThrow) {
    throw new Error("No page config found!");
  }
  return data?.attributes;
}
