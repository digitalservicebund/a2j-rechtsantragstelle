import { translations } from "~/services/translations/translations";
import { Icon } from "../../../common/Icon";
import { footerContent } from "./footerContent";

export const KernFooterExternalLinks = () => {
  const externalLinksSections = footerContent.filter((section) =>
    section.type.includes("externalLink"),
  );
  return (
    <div className="col-start-1 lg:col-start-7 col-span-12 lg:col-span-6 flex flex-col md:flex-row gap-kern-space-default">
      {externalLinksSections.map((section) => {
        const link = section.content[0];
        return (
          <p
            key={section.key}
            className="kern-body kern-body--bold gap-kern-space-small flex flex-col md:w-1/2 md:max-w-1/2 p-kern-space-default!"
          >
            {section.title}
            <a
              href={link.url}
              className="kern-link inline-block p-0! no-underline! wrap-anywhere"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.text}, ${translations.navigation.linkOpensNewTab.de}`}
            >
              <Icon name="open-in-new" className="size-[1em] inline! mt-3" />
              {link.text}
            </a>
          </p>
        );
      })}
    </div>
  );
};
