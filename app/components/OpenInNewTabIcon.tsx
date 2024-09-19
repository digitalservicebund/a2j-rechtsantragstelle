import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";

export const openInNewAllowedAttributes = {
  svg: [
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

export const OpenInNewTabIcon = () =>
  OpenInNewIcon({
    height: "1.2em",
    width: "1.2em",
    style: {
      display: "inline-block",
      marginLeft: "0.2em",
      marginBottom: "4px",
    },
  });
