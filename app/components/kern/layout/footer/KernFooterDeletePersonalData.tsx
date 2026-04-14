import { GridItem } from "~/components/layout/grid/GridItem";
import { translations } from "~/services/translations/translations";
import { footerContent } from "./footerContent";
import { KernIcon } from "~/components/kern/common/KernIcon";

export const KernFooterDeletePersonalData = () => {
  const personalDataDeleteLink = footerContent.find((section) =>
    section.type.includes("deletionBanner"),
  )?.content[0];

  return (
    <GridItem
      row={3}
      className="bg-kern-neutral-025! mb-40 lg:mb-0 mx-0! text-white print:hidden text-center pt-16 pb-16"
    >
      <a className="kern-link items-center!" href={personalDataDeleteLink?.url}>
        <KernIcon className="size-[1em]" name="arrow-forward" />
        {translations["delete-data"].footerLinkLabel.de ??
          personalDataDeleteLink?.text}
      </a>
    </GridItem>
  );
};
