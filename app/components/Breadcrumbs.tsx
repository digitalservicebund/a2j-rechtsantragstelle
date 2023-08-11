import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { getStrapiPage } from "~/services/cms/index.server";

type Breadcrumb = {
  url: string;
  title?: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

export function breadcrumbsFromURL(url: string) {
  const { pathname } = new URL(url);
  const pathnameSplit = pathname === "/" ? [] : pathname.split("/").slice(1);

  return Promise.all(
    pathnameSplit.map(async (_, idx, array) => {
      const url = "/" + array.slice(0, idx + 1).join("/");
      try {
        // TODO: maybe add getStrapiPageMeta ?
        return { url, title: (await getStrapiPage({ slug: url })).meta.title };
      } catch {
        return { url };
      }
    }),
  );
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined,
  );

  return (
    validBreadcrumbs.length > 0 && (
      <nav className="py-8 px-16 bg-blue-100 flex flex-wrap items-center text-base">
        {/* Note: can't use <Link> or <NavLink> as we require fresh data from the root loader */}
        <a
          href="/"
          aria-label="Startseite"
          className="focus:outline ds-link-01-bold"
        >
          <HomeOutlinedIcon className="!h-[1.6rem] !w-[1.6rem]" />
        </a>
        {validBreadcrumbs.map((breadcrumb, idx, arr) => (
          <div key={breadcrumb.title}>
            <span className="mx-8">/</span>
            <span>
              {idx === arr.length - 1 ? (
                <span>{breadcrumb.title}</span>
              ) : (
                <a
                  href={breadcrumb.url}
                  className="text-link increase-tap-area"
                >
                  {breadcrumb.title}
                </a>
              )}
            </span>
          </div>
        ))}
      </nav>
    )
  );
}
