import cms from "~/services/cms";

export default async function (
  request: Request,
  options?: { dontThrow: boolean }
) {
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
