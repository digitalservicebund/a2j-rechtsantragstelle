import classNames from "classnames";
import { PLACEHOLDER_REGEX } from "~/services/security/markdownUtilities";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";
import { OpenInNewTabIcon } from "./OpenInNewTabIcon";

type StandaloneLinkProps = Readonly<{
  url: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}>;

const OPEN_NEW_TAB = "öffnet neues Fenster";

export const StandaloneLink = ({
  url,
  text,
  icon,
  className,
}: StandaloneLinkProps) => {
  const shouldOpenNewTab =
    isExternalUrl(url) || PLACEHOLDER_REGEX.test(url) || isFileDownloadUrl(url);
  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: url,
    className: classNames("text-link min-h-[24px]", className),
    ...(shouldOpenNewTab
      ? {
          "aria-label": `${text}, ${OPEN_NEW_TAB}`,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {}),
  };

  return (
    <a {...anchorProps}>
      {icon}
      {text}
      {shouldOpenNewTab && <OpenInNewTabIcon />}
    </a>
  );
};
