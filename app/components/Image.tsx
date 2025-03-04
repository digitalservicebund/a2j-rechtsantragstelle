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

  const renderSvg = () => {
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
  };

  const renderImage = () => {
    return <img {...props} src={url} alt={alternativeText ?? ""} />;
  };

  if (!isSvg) {
    return renderImage();
  }

  if (!jsAvailable) {
    /**
     * <noscript> tag prevents that <img> is cached by the browser when js is available
     * more details here: https://github.com/tanem/react-svg/issues/197 and https://serverfault.com/a/856948
     */
    return <noscript>{renderImage()}</noscript>;
  }

  return renderSvg();
}

export default Image;
