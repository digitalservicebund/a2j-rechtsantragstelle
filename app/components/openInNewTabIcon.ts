import OpenInNewIcon from "@digitalservicebund/icons/OpenInNew";
import ReactDOMServer from "react-dom/server";

export const openInNewIconText = ReactDOMServer.renderToString(
  OpenInNewIcon({
    height: "1.2em",
    width: "1.2em",
    style: {
      display: "inline-block",
      marginLeft: "0.2em",
      marginBottom: "4px",
    },
  }),
);
export const openInNewAllowedTags = ["svg", "path"] as const;
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
