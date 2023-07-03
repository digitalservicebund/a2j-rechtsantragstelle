import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { getStrapiPage } from "~/services/cms";

type Breadcrumb = {
  url: string;
  title?: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

export async function breadcrumbsFromURL(url: string) {
  const { pathname } = new URL(url);
  const pathnameSplit = pathname === "/" ? [] : pathname.split("/").slice(1);

  return (await Promise.all(
    pathnameSplit.map(async (_, idx, array) => {
      const url = "/" + array.slice(0, idx + 1).join("/");
      try {
        // TODO: maybe add getStrapiPageMeta ?
        return { url, title: (await getStrapiPage({ slug: url })).meta.title };
      } catch {
        return { url };
      }
    })
  )) satisfies Array<Breadcrumb>;
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined
  );

  return (
    validBreadcrumbs.length > 0 && (
      <nav className="py-8 px-16 ds-link-02-bold font-normal bg-blue-100">
        {/* Note: can't use <Link> or <NavLink> as we require fresh data from the root loader */}
        <a
          href="/"
          className="hover:underline focus:outline active:underline active:decoration-4"
          aria-label="Startseite"
        >
          <HomeOutlinedIcon />
        </a>
        {validBreadcrumbs.map((breadcrumb, idx, arr) => (
          <span key={breadcrumb.title}>
            <span className="mx-8 text-black">/</span>
            {idx === arr.length - 1 ? (
              <span className="text-black">{breadcrumb.title}</span>
            ) : (
              <a
                href={breadcrumb.url}
                className="text-link increase-tap-area visited:text-blue-800"
              >
                {breadcrumb.title}
              </a>
            )}
          </span>
        ))}
      </nav>
    )
  );
}
