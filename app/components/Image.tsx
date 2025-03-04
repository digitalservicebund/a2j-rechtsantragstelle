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
      {...props}
      id="svg-image"
      src={url}
      title={svgAltText}
      role="img"
      height="100%"
    />
  ) : (
    <img {...props} src={url} alt={alternativeText ?? ""} />
  );
}

export default Image;
