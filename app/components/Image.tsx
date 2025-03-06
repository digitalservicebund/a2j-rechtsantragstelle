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
  const altText =
    !alternativeText || alternativeText === "" ? "image" : alternativeText;

  const ImageComponent = (
    <img {...props} src={url} alt={altText} title={altText} />
  );

  if (!isSvg) {
    return ImageComponent;
  }

  if (!jsAvailable) {
    /**
     * <noscript> tag prevents that <img> is cached by the browser when js is available
     * more details here: https://github.com/tanem/react-svg/issues/197 and https://serverfault.com/a/856948
     */
    return <noscript>{ImageComponent}</noscript>;
  }
  return (
    <Svg
      {...props}
      /* This class ensures black SVG paths don't disappear in high-contrast mode. 
        For implementation details check app/styles.css */
      className="svg-image"
      src={url}
      title={altText}
      role="img"
      height="100%"
    />
  );
}

export default Image;
