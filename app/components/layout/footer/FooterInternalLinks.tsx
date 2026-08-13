import { translations } from "~/services/translations/translations";
import { footerContent } from "./footerContent";

export const FooterInternalLinks = () => {
  const internalLinksSections = footerContent.filter((section) =>
    section.type.includes("internalLink"),
  );

  return (
    <nav
      className="col-start-1 lg:col-start-7 col-span-12 lg:col-span-6 flex flex-col md:flex-row gap-kern-space-default! print:hidden"
      aria-label={translations.footer.internalLinks.de}
    >
      {internalLinksSections.map((section) => {
        const ariaLabelledBy = `footer-list-${section.key}`;
        return (
          <div
            key={section.key}
            className="kern-body kern-body--bold flex flex-col gap-kern-space-small md:w-1/2 md:max-w-1/2 p-kern-space-default!"
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
