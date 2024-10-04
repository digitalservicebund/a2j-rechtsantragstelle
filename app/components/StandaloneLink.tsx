import classNames from "classnames";
import { isExternalUrl, isFileDowloadUrl } from "~/util/url";
import { OpenInNewTabIcon } from "./OpenInNewTabIcon";

type StandaloneLinkProps = Readonly<{
  url: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}>;

export const OPEN_NEW_TAB = "öffnet neues Fenster";

export const StandaloneLink = ({
  url,
  text,
  icon,
  className,
}: StandaloneLinkProps) => {
  const isExternal = isExternalUrl(url);
  const isDownload = isFileDowloadUrl(url);
  const shouldOpenNewTab = isExternal || isDownload;
  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: url,
    "aria-label": text,
    className: classNames("text-link min-h-[24px]", className),
    ...(shouldOpenNewTab
      ? {
          "aria-label": `${text}, ${OPEN_NEW_TAB}`,
          target: "_blank",
          rel: "noopener noreferrer",
          title: OPEN_NEW_TAB,
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
