import SVG from "react-inlinesvg";

export type ImageProps = Readonly<{
  url?: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
}>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
  if (!url) return null;
  // Need to inline SVG components for accessibility
  const isSvg = url.endsWith(".svg");
  return isSvg ? (
    <SVG
      {...props}
      src={url}
      width={width}
      title={alternativeText ?? "image"} //force to have an alternative text and avoid a11y errors
      role="img"
      height="100%"
    />
  ) : (
    <img
      {...props}
      src={url}
      alt={alternativeText ?? ""} // without alternative text an image is treated as decorative
      width={width}
      height={height}
    />
  );
}

export default Image;
