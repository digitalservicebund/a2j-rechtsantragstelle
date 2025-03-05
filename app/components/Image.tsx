import classNames from "classnames";
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

  const containerClasses = classNames(
    "bg-white p-4 border-2 border-transparent forced-colors:bg-black border-2 border-white",
  );

  const imageClasses = classNames(
    "forced-colors:brightness-0 forced-colors:invert",
  );

  if (!url) return null;

  const isSvg = url.endsWith(".svg");
  const altText =
    !alternativeText || alternativeText === "" ? "image" : alternativeText;

  if (!isSvg) {
    return (
      <div className={containerClasses}>
        <img
          className={imageClasses}
          {...props}
          src={url}
          alt={altText}
          title={altText}
        />
      </div>
    );
  }

  if (!jsAvailable) {
    /**
     * <noscript> tag prevents that <img> is cached by the browser when js is available
     * more details here: https://github.com/tanem/react-svg/issues/197 and https://serverfault.com/a/856948
     */
    return (
      <noscript>
        <div className={containerClasses}>
          <img
            className={imageClasses}
            {...props}
            src={url}
            alt={altText}
            title={altText}
          />
        </div>
      </noscript>
    );
  }
  return (
    <Svg
      {...props}
      /* This id ensures black SVG paths don't disappear in high-contrast mode. 
        For implementation details check app/styles.css */
      id="svg-image"
      src={url}
      title={altText}
      role="img"
      height="100%"
    />
  );
}

export default Image;
