import { footerContent } from "./footerContent";
import { Icon } from "~/components/common/Icon";
import { layoutTranslations } from "~/services/translations/layout";

export const FooterExternalLinks = () => {
  const externalLinksSections = footerContent.filter((section) =>
    section.type.includes("externalLink"),
  );
  return (
    <div className="col-start-1 lg:col-start-7 col-span-12 lg:col-span-6 flex flex-col md:flex-row gap-kern-space-default">
      {externalLinksSections.map((section) => {
        return (
          <p
            key={section.key}
            className="kern-body kern-body--bold gap-kern-space-small flex flex-col md:w-1/2 md:max-w-1/2 p-kern-space-default!"
          >
            {section.title}
            {section.content.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="kern-link inline-block p-0! no-underline! hover:underline! wrap-anywhere"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.text}, ${layoutTranslations.navigation.linkOpensNewTab.de}`}
              >
                <Icon name="open-in-new" className="size-[1em] inline! mt-3" />
                {link.text}
              </a>
            ))}
          </p>
        );
      })}
    </div>
  );
};
