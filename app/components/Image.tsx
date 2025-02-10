import SVG from "react-inlinesvg";

export type ImageProps = Readonly<{
  url?: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
}>;

function Image({ url, alternativeText, ...props }: ImageProps) {
  if (!url) return null;
  const isSvg = url.endsWith(".svg");
  const svgAltText =
    !alternativeText || alternativeText === "" ? "image" : alternativeText;

  return isSvg ? (
    <SVG
      className={props.className}
      width={props.width}
      id="svg-image"
      src={url}
      title={svgAltText}
      role="img"
      height="100%"
    />
  ) : (
    <img
      className={props.className}
      width={props.width}
      height={props.height}
      src={url}
      alt={alternativeText ?? ""}
    />
  );
}

export default Image;
