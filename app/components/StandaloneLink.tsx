import classNames from "classnames";
import { isExternalUrl, isFileDowloadUrl } from "~/util/url";
import { OpenInNewTabIcon } from "./OpenInNewTabIcon";

type StandaloneLinkProps = Readonly<{
  url: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}>;

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
    className: classNames("text-link", className),
    ...(shouldOpenNewTab
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
          title: "öffnet neues Fenster",
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
