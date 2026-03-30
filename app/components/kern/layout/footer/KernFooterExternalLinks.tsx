import { translations } from "~/services/translations/translations";
import { KernIcon } from "../../common/KernIcon";
import { footerContent } from "./footerContent";

export const KernFooterExternalLinks = () => {
  const externalLinksSections = footerContent.filter((section) =>
    section.type.includes("externalLink"),
  );
  return (
    <div>
      {externalLinksSections.map((section) => {
        const link = section.content[0];
        return (
          <p key={section.key} className="kern-body gap-kern-space-default">
            {section.title}{" "}
            <a
              href={link.url}
              className="kern-link inline-block p-0! no-underline!"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.text}, ${translations.navigation.linkOpensNewTab.de}`}
            >
              <KernIcon
                name="open-in-new"
                className="size-[1em] inline! mt-3"
              />
              {link.text}
            </a>
          </p>
        );
      })}
    </div>
  );
};
