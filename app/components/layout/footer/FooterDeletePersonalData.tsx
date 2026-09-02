import { layoutTranslations } from "~/services/translations/layout";
import { footerContent } from "./footerContent";
import { Icon } from "~/components/common/Icon";

export const FooterDeletePersonalData = () => {
  const personalDataDeleteLink = footerContent.find((section) =>
    section.type.includes("deletionBanner"),
  )?.content[0];

  return (
    <div className="bg-kern-neutral-025! mb-80 lg:mb-0 mx-0! text-white print:hidden text-center pt-16 pb-16">
      <a
        className="kern-link items-center! no-underline! hover:underline!"
        href={personalDataDeleteLink?.url}
      >
        <Icon className="size-[1em]" name="arrow-forward" />
        {layoutTranslations["footer"].footerLinkLabel.de ??
          personalDataDeleteLink?.text}
      </a>
    </div>
  );
};
