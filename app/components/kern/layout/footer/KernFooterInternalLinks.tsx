import { type CategorizedLinkProps } from "./KernFooter";

const dashifyLowercase = (text: string) =>
  text.toLowerCase().replaceAll(/\s+/g, "-");

export type KernFooterInternalLinksProps = {
  categorizedLinks: CategorizedLinkProps[];
  ariaLabel?: string;
};

type KernInternalLinkCategoryProps = {
  category: CategorizedLinkProps;
};

const KernInternalLinkCategory = ({
  category,
}: KernInternalLinkCategoryProps) => {
  const ariaLabelledBy = `footer-list-${dashifyLowercase(category.title)}`;

  return (
    <div
      key={category.id}
      className="flex flex-col gap-kern-space-small py-kern-space-large"
    >
      <h2 className="kern-body--bold">{category.title}</h2>
      <ul
        aria-labelledby={ariaLabelledBy}
        className="list-none! flex flex-col gap-kern-space-small"
      >
        {category.links.map((link) => {
          return (
            <li key={link.url}>
              <a href={link.url} className="kern-link">
                {link.text ?? ""}{" "}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const KernFooterInternalLinks = ({
  categorizedLinks,
  ariaLabel,
}: KernFooterInternalLinksProps) => {
  return (
    <nav
      className="flex flex-col sm:flex-row justify-between print:hidden"
      aria-label={ariaLabel}
    >
      {categorizedLinks.map((category) => {
        return (
          <KernInternalLinkCategory key={category.id} category={category} />
        );
      })}
    </nav>
  );
};
