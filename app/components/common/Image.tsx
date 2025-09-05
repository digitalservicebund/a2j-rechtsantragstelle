import { InlineSvgImage } from "./InlineSvgImage";

export type ImageProps = Readonly<{
  url: string;
  ariaHidden?: boolean;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
  svgString?: string;
}>;
// An empty alt attribute is needed for accessibility when the image is decorative
const EMPTY_ALTERNATIVE_TEXT = "";

function Image({
  url,
  ariaHidden,
  alternativeText,
  svgString,
  ...props
}: ImageProps) {
  const altText = alternativeText ?? EMPTY_ALTERNATIVE_TEXT;

  if (svgString)
    return (
      <InlineSvgImage
        svgString={svgString}
        width={props.width ?? 0}
        altText={altText}
      />
    );

  return (
    <img
      {...props}
      src={url}
      alt={altText}
      title={altText}
      aria-hidden={ariaHidden}
    />
  );
}

export default Image;
