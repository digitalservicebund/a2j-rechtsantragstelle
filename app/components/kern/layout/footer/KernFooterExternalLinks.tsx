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
              className="kern-link inline-flex items-center gap-1 no-underline!"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KernIcon
                name="open-in-new"
                className="w-[1em] h-[1em] flex-shrink-0 mt-4"
              />
              {link.text}
            </a>
          </p>
        );
      })}
    </div>
  );
};
