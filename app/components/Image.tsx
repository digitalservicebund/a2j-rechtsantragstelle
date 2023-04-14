export type ImageProps = {
  url?: string;
  presentational?: boolean;
  data?: {
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
      ext: ".png";
    };
  };
};

function Image({ url, data, presentational, ...props }: ImageProps) {
  if (url) return <img {...props} src={url} />;

  if (!data) return null;

  const imageUrl = data.attributes.url;
  const imageWidth = data.attributes.width;
  const imageHeight = data.attributes.height;

  let width = imageWidth;
  let height = imageHeight;

  if (data.attributes.ext === ".png") {
    width = imageWidth / 2;
    height = imageHeight / 2;
  }

  const altText = data.attributes.alternativeText || undefined;

  if (!presentational && !altText) {
    console.warn("Missing alt text");
  }

  return (
    <img
      {...props}
      src={imageUrl}
      alt={presentational ? "" : altText}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

export default Image;
