import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { KernIcon } from "~/components/kern/common/KernIcon";

type KernBreadcrumb = {
  url: string;
  title?: string;
};

type KernBreadcrumbsProps = {
  readonly breadcrumbs: KernBreadcrumb[];
  readonly ariaLabel?: string;
  readonly linkLabel?: string;
};

export default function KernBreadcrumbs({
  ariaLabel,
  breadcrumbs,
  linkLabel,
}: KernBreadcrumbsProps) {
  const validBreadcrumbs = breadcrumbs?.filter(
    (breadcrumb) => breadcrumb.title !== undefined,
  );
  if (validBreadcrumbs.length === 0) return null;

  return (
    <GridSection className="bg-kern-neutral-050">
      <Grid>
        <GridItem
          smColumn={{ start: 1, span: 12 }}
          mdColumn={{ start: 1, span: 12 }}
          lgColumn={{ start: 1, span: 12 }}
          xlColumn={{ start: 1, span: 12 }}
        >
          <nav
            className={`py-16 flex flex-wrap items-center align-center gap-kern-space-x-small`}
            aria-label={ariaLabel}
          >
            {/* Note: can't use <Link> or <NavLink> as we require fresh data from the root loader */}
            <a href="/" aria-label={linkLabel} className="focus:outline-solid">
              <KernIcon name="home" className="fill-kern-action-default!" />
            </a>
            {validBreadcrumbs.map((breadcrumb, idx, arr) => (
              <div key={breadcrumb.title} className="kern-body-small flex ">
                <KernIcon
                  name="chevron-right"
                  className="fill-kern-neutral-300!"
                />
                {idx === arr.length - 1 ? (
                  <span className="text-kern-layout-text-default kern-body kern-body--small p-0!">
                    {breadcrumb.title}
                  </span>
                ) : (
                  <a
                    href={breadcrumb.url ?? ""}
                    className="increase-tap-area kern-link kern-link--small p-0!"
                  >
                    {breadcrumb.title ?? ""}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </GridItem>
      </Grid>
    </GridSection>
  );
}
