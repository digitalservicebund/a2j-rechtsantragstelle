import { z } from "zod";

export const ImagePropsSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  alternativeText: z.string().optional(),
});

type ImageProps = z.infer<typeof ImagePropsSchema>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
  if (!url) return null;

  return (
    <img
      {...props}
      src={url}
      alt={alternativeText}
      width={width}
      height={height}
    />
  );
}

export default Image;
