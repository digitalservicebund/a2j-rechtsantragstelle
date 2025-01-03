import HomeOutlinedIcon from "@digitalservicebund/icons/HomeOutlined";
import { StandaloneLink } from "./StandaloneLink";

export type Breadcrumb = {
  url: string;
  title?: string;
};

type BreadcrumbsProps = {
  readonly breadcrumbs: Breadcrumb[];
  readonly linkLabel?: string;
};

export default function Breadcrumbs({
  breadcrumbs,
  linkLabel,
}: BreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined,
  );

  return (
    validBreadcrumbs.length > 0 && (
      <nav
        className="py-8 px-16 bg-blue-100 flex flex-wrap items-center"
        aria-label="Breadcrumbs"
      >
        {/* Note: can't use <Link> or <NavLink> as we require fresh data from the root loader */}
        <a
          href="/"
          aria-label={linkLabel}
          className="focus:outline ds-link-01-bold"
        >
          <HomeOutlinedIcon className="!h-[1.6rem] !w-[1.6rem]" />
        </a>
        {validBreadcrumbs.map((breadcrumb, idx, arr) => (
          <div key={breadcrumb.title} className="ds-body-02-reg">
            <span className="mx-8">/</span>
            {idx === arr.length - 1 ? (
              <span>{breadcrumb.title}</span>
            ) : (
              <StandaloneLink
                text={breadcrumb.title ?? ""}
                url={breadcrumb.url ?? ""}
                className="increase-tap-area"
              />
            )}
          </div>
        ))}
      </nav>
    )
  );
}
