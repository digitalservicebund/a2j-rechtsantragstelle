import HomeOutlinedIcon from "@digitalservicebund/icons/HomeOutlined";
import { StandaloneLink } from "../common/StandaloneLink";
import { Grid } from "./grid/Grid";
import { GridItem } from "./grid/GridItem";
import { GridSection } from "./grid/GridSection";

export type Breadcrumb = {
  url: string;
  title?: string;
};

type BreadcrumbsProps = {
  readonly breadcrumbs: Breadcrumb[];
  readonly ariaLabel?: string;
  readonly linkLabel?: string;
};

export default function Breadcrumbs({
  ariaLabel,
  breadcrumbs,
  linkLabel,
}: BreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined,
  );
  if (validBreadcrumbs.length === 0) return null;

  return (
    <GridSection className="bg-blue-100">
      <Grid>
        <GridItem
          smColumn={{ start: 1, span: 12 }}
          mdColumn={{ start: 1, span: 12 }}
          lgColumn={{ start: 1, span: 12 }}
          xlColumn={{ start: 1, span: 12 }}
        >
          <nav
            className={`py-8! flex flex-wrap items-center`}
            aria-label={ariaLabel}
          >
            {/* Note: can't use <Link> or <NavLink> as we require fresh data from the root loader */}
            <a
              href="/"
              aria-label={linkLabel}
              className="focus:outline-solid ds-link-01-bold"
            >
              <HomeOutlinedIcon className="h-[1.6rem]! w-[1.6rem]!" />
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
      </Grid>
    </GridSection>
  );
}
