import Svg from "react-inlinesvg";
import { useJsAvailable } from "~/services/hooks/useJsAvailable";

export type ImageProps = Readonly<{
  url: string;
  ariaHidden?: boolean;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
}>;

// Create a constant variable to avoid complains from Sonar
const SVG_ROLE = "img";

function Image({ url, ariaHidden, alternativeText, ...props }: ImageProps) {
  const jsAvailable = useJsAvailable();

  const isSvg = url.endsWith(".svg");
  const altText =
    !alternativeText || alternativeText === "" ? "image" : alternativeText;

  const ImageComponent = (
    <img
      {...props}
      src={url}
      alt={altText}
      title={altText}
      aria-hidden={ariaHidden}
    />
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
      role={SVG_ROLE}
      aria-hidden={ariaHidden}
      height="100%"
    />
  );
}

export default Image;
