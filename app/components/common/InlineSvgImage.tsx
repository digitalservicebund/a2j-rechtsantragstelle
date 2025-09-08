import parse from "html-react-parser";
import { cloneElement, isValidElement, type ReactElement } from "react";

type InlineSvgProps = {
  svgString: string;
  width?: number;
  altText?: string;
};

const isSVGElement = (node: ReactElement): node is React.ReactSVGElement =>
  node.type === "svg";
const sanatizeSvgString = (svgString: string) =>
  svgString.slice(svgString.search("<svg"));

const staticProps = { className: "svg-image", role: "img", height: "100%" };

export const InlineSvgImage = ({ svgString, width, altText }: InlineSvgProps) =>
  parse(sanatizeSvgString(svgString), {
    transform: (node) => {
      if (isValidElement(node)) {
        if (!isSVGElement(node)) return node; // valid non-svg elements can just be returned
        const props = { ...staticProps, width, "aria-hidden": !altText };
        return cloneElement(node, props, [
          altText && <title key="title">{altText}</title>,
          node.props.children,
        ]);
      }
    },
  });
