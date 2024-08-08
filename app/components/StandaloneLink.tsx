import { isExternalUrl } from "~/util/url";
import { OpenInNewTabIcon } from "./openInNewTabIcon";

type StandaloneLinkProps = Readonly<{
  url: string;
  text: string;
  icon?: React.ReactNode;
}>;

export const StandaloneLink = ({ url, text, icon }: StandaloneLinkProps) => {
  const isExternal = isExternalUrl(url);
  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: url,
    className: "text-link",
    ...(isExternal
      ? { target: "_blank", rel: "noreferrer", title: "öffnet neues Fenster" }
      : {}),
  };

  return (
    <a {...anchorProps}>
      {icon}
      {text}
      {isExternal && <OpenInNewTabIcon />}
    </a>
  );
};
