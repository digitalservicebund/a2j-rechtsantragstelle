import { translations } from "~/services/translations/translations";
import { footerContent } from "./footerContent";
import { Icon } from "~/components/common/Icon";

export const FooterDeletePersonalData = () => {
  const personalDataDeleteLink = footerContent.find((section) =>
    section.type.includes("deletionBanner"),
  )?.content[0];

  return (
    <div className="bg-kern-neutral-025! mb-40 lg:mb-0 mx-0! text-white print:hidden text-center pt-16 pb-16">
      <a className="kern-link items-center!" href={personalDataDeleteLink?.url}>
        <Icon className="size-[1em]" name="arrow-forward" />
        {translations["delete-data"].footerLinkLabel.de ??
          personalDataDeleteLink?.text}
      </a>
    </div>
  );
};
