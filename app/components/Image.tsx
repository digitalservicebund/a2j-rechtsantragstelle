import SVG from "react-inlinesvg";

export type ImageProps = Readonly<{
  url?: string;
  ext?: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
}>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
  if (!url) return null;
  // Need to inline SVG components for accessibility
  const isSvg = props.ext === ".svg";
  return isSvg ? (
    <SVG
      {...props}
      src={url}
      width={width}
      title={alternativeText}
      role="img"
      height={"auto"}
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
