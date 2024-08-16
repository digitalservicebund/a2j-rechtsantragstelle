import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";

type OpenInNewTabIconProps = {
  ariaLabelledBy: string;
};

export const openInNewAllowedTags = ["svg", "path"] as const;
export const openInNewAllowedAttributes = {
  svg: [
    "aria-labelledby",
    "xmlns",
    "height",
    "viewbox",
    "width",
    "role",
    "focusable",
    "aria-hidden",
    "style",
  ],
  path: ["d", "fill"],
};

export const OpenInNewTabIcon = ({ ariaLabelledBy }: OpenInNewTabIconProps) =>
  OpenInNewIcon({
    height: "1.2em",
    width: "1.2em",
    "aria-labelledby": ariaLabelledBy,
    style: {
      display: "inline-block",
      marginLeft: "0.2em",
      marginBottom: "4px",
    },
  });
