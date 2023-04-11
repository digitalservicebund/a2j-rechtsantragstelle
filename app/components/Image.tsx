export type ImageProps = {
  url?: string;
};

function Image({ url }: ImageProps) {
  if (!url) return null;

  return <img src={url} />;
}

export default Image;
