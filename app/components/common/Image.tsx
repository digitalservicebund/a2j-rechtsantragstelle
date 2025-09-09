import { InlineSvgImage } from "./InlineSvgImage";

type SharedProps = {
  ariaHidden?: boolean;
  width?: number;
  height?: number;
  alternativeText?: string;
  className?: string;
};

export type ImageProps = Readonly<
  SharedProps &
    ({ url: string; svgString?: string } | { url?: string; svgString: string })
>;

function Image({
  url,
  ariaHidden,
  alternativeText,
  svgString,
  ...props
}: ImageProps) {
  if (svgString)
    return (
      <InlineSvgImage
        svgString={svgString}
        width={props.width}
        altText={alternativeText}
      />
    );

  // A11y: Empty alt text & title for decorative images
  const altTitle = alternativeText ?? "";
  return (
    <img
      {...props}
      src={url}
      alt={altTitle}
      title={altTitle}
      aria-hidden={ariaHidden}
    />
  );
}

export default Image;
