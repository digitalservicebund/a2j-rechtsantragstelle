import { useState, useEffect } from "react";
import Svg from "react-inlinesvg";

export type ImageProps = Readonly<{
  url?: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
}>;

function Image({ url, alternativeText, ...props }: ImageProps) {
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  if (!url) return null;

  const isSvg = url.endsWith(".svg");
  const svgAltText =
    !alternativeText || alternativeText === "" ? "image" : alternativeText;

  if (isSvg) {
    if (jsAvailable) {
      return (
        <Svg
          {...props}
          id="svg-image"
          src={url}
          title={svgAltText}
          role="img"
          height="100%"
        />
      );
    } else {
      return (
        <noscript>
          <img {...props} src={url} alt={alternativeText ?? ""} />
        </noscript>
      );
    }
  } else {
    return <img {...props} src={url} alt={alternativeText ?? ""} />;
  }
}

export default Image;
