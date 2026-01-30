import { footerContent } from "./footerContent";

export type KernFooterInternalLinksProps = {
  ariaLabel?: string;
};

export const KernFooterInternalLinks = ({
  ariaLabel,
}: KernFooterInternalLinksProps) => {
  const internalLinksSections = footerContent.filter((section) =>
    section.type.includes("internalLink"),
  );

  return (
    <nav
      className="flex flex-col sm:flex-row justify-between print:hidden"
      aria-label={ariaLabel}
    >
      {internalLinksSections.map((section) => {
        const ariaLabelledBy = `footer-list-${section.key}`;
        return (
          <div
            key={section.key}
            className="flex flex-col gap-kern-space-small py-kern-space-large"
          >
            <h2 className="kern-body--bold">{section.sectionName}</h2>
            <ul
              aria-labelledby={ariaLabelledBy}
              className="list-none! flex flex-col gap-kern-space-small"
            >
              {section.content.map((link) => {
                return (
                  <li key={link.url}>
                    <a href={link.url} className="kern-link">
                      {link.text ?? ""}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
};
