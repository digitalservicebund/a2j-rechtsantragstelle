import { translations } from "~/services/translations/translations";
import { footerContent } from "./footerContent";

export const KernFooterInternalLinks = () => {
  const internalLinksSections = footerContent.filter((section) =>
    section.type.includes("internalLink"),
  );

  return (
    <nav
      className="flex flex-col sm:flex-row gap-kern-space-large justify-between print:hidden"
      aria-label={translations.footer.internalLinks.de}
    >
      {internalLinksSections.map((section) => {
        const ariaLabelledBy = `footer-list-${section.key}`;
        return (
          <div key={section.key} className="flex flex-col gap-kern-space-small">
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
