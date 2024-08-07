import classNames from "classnames";
import { z } from "zod";
import { iconSchema } from "./Button";
import { OpenInNewTabIcon } from "./openInNewTabIcon";
import { isExternalUrl } from "../util/url";

export const StandaloneLinkPropsSchema = z.object({
  id: z.number().optional(),
  url: z.string(),
  text: z.string(),
  icon: iconSchema.optional(),
  look: z
    .enum([
      "ds-label-01-reg",
      "ds-label-01-bold",
      "ds-label-02-reg",
      "ds-label-02-bold",
      "ds-label-03-reg",
      "ds-label-03-bold",
    ])
    .optional(),
});

type StandaloneLinkProps = z.input<typeof StandaloneLinkPropsSchema>;

export const StandaloneLink = ({
  id,
  url,
  text,
  icon,
  look,
}: StandaloneLinkProps) => {
  const isExternal = isExternalUrl(url);
  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    id: id?.toString(),
    href: url,
    className: classNames("text-link", look),
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
