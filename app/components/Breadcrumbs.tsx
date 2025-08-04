import HomeOutlinedIcon from "@digitalservicebund/icons/HomeOutlined";
import classNames from "classnames";
import { GridContainer, GridItem } from "~/components";
import { StandaloneLink } from "./StandaloneLink";

export type Breadcrumb = {
  url: string;
  title?: string;
};

type BreadcrumbsProps = {
  readonly breadcrumbs: Breadcrumb[];
  readonly ariaLabel?: string;
  readonly linkLabel?: string;
  readonly alignToMainContainer?: boolean;
};

export default function Breadcrumbs({
  ariaLabel,
  breadcrumbs,
  linkLabel,
}: BreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined,
  );
  const navClassNames = classNames("flex flex-wrap items-center", "h-[64px]");

  return (
    validBreadcrumbs.length > 0 && (
      <GridContainer columns={12} maxWidth="xl" className="bg-blue-100">
        <GridItem
          span={5}
          colStartXs={1}
          colStartSm={1}
          colStartMd={1}
          colStartLg={1}
        >
          <nav className={navClassNames} aria-label={ariaLabel}>
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
        </GridItem>
      </GridContainer>
    )
  );
}
