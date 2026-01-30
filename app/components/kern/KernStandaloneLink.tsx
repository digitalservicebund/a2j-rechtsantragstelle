import { mustachePlaceholderRegex } from "~/services/security/mustachePlaceholder";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";
import classNames from "classnames";
import { KernIcon } from "./common/KernIcon";

type KernStandaloneLinkProps = Readonly<{
  url: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
  dataTestid?: string;
  ["aria-describedby"]?: string;
}>;

const OPEN_NEW_TAB = "öffnet neues Fenster";

export const KernStandaloneLink = ({
  url,
  text,
  icon,
  className,
  dataTestid,
  ["aria-describedby"]: ariaDescribedBy,
}: KernStandaloneLinkProps) => {
  const shouldOpenNewTab =
    isExternalUrl(url) ||
    mustachePlaceholderRegex.test(url) ||
    isFileDownloadUrl(url);
  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: url,
    className: classNames("kern-link min-h-[24px]", className),
    "aria-describedby": ariaDescribedBy,
    ...(shouldOpenNewTab
      ? {
          "aria-label": `${text}, ${OPEN_NEW_TAB}`,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {}),
  };

  return (
    <a {...anchorProps} className={className} data-testid={dataTestid}>
      {icon}
      {text}
      {shouldOpenNewTab && <KernIcon name="open-in-new" />}
    </a>
  );
};
