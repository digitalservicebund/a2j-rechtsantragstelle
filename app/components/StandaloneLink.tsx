import classNames from "classnames";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";
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
  const interpolatedExternalUrl = url.startsWith("{") && url.endsWith("}");
  const shouldOpenNewTab =
    isExternalUrl(url) || interpolatedExternalUrl || isFileDownloadUrl(url);
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
